const port = 443;

const express = require( "express" );
const { RateLimiterMemory } = require("rate-limiter-flexible");
const app = express();
const http = require( "http" ).createServer(app);
const io = require( "socket.io" )( http, {
    maxHttpBufferSize: 300,
    cors: {
        origin: "*",
        credentials: true
    }
} );

app.set( 'trust proxy', true );

const rateLimiter = new RateLimiterMemory({
    points: 2,
    duration: 1,
  });
  
/*
const limiter = rateLimit( {
    windowMs: 1000,
    max: 2, // limit each IP to max requests per windowMs
    message: "Too many requests from this IP, please try again later",
    handler: (req, res) => {
        console.log(`AAA from IP ${req.ip} has been limited.`);
        res.status(429).json({ error: "BBB, please try again later" });
    },
} );
*/

app.use(express.static("public"));

io.on( "connect", ( socket ) => {

    // CONNECTION
    const clientIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    console.log( 'NEW CONNECTION from ', socket.id, "IP:", clientIP, ShowNumClients() );

    // RECEIVE EMIT CALL
    socket.use( ( packet, next ) => {
        console.log( "GOT > " + packet[0] );
        rateLimiter.consume(socket.handshake.address)
        .then(() => {
          console.log('Emit allowed:', socket.id, 'Event:', packet[0]);
          next();
        })
        .catch((rejRes) => {
          console.log('Emit REJECTED:', socket.id, 'Event:', packet[0]);
          next(new Error('TOO MANY EMIT CALLS from this IP, please try again later'));
        });
    } );

    // DISCONNECTION LISTENER
    socket.on( 'disconnect', () => {
        console.log('DISCONNECTION  from: ', socket.id, ShowNumClients() );
    } );

    // JOINING LISTENER
    socket.on( 'joining', ( data ) => {
        console.log( "JOINED!" );
    } );
} );

function ShowNumClients() {
    return '(' + io.engine.clientsCount + ')';
}

http.listen( port );
 
if ( process.env.NODE_ENV === 'production' ) {
    console.log("Application is SERVER OK");
} else {
    console.log("Application is LOCALHOST");
}
/*
// Middleware to log incoming messages
io.use((socket, next) => {
    socket.onAny( ( eventName, ...args ) => {
        //let time = new Date().toISOString();
        //console.log(`Received event '${eventName}' from ${socket.id}: at ${time}`, args);

        if (eventName === 'askInfo') {
            console.log( 'Data received:', args );
            const responseData = args.map(value => value * 2);
            socket.emit('answerInfo', responseData);
        }
    });
    next();
} );



updateClients();
function updateClients() {
    let seconds = new Date().getSeconds();

    if ( process.env.NODE_ENV === 'production' ) {
        seconds = 'Application is SERVER NEW '+seconds;
    } else {
        seconds = 'Application is LOCALHOST '+seconds;
    }
 
    let centers = [];
    for ( let i = 0; i < 100; i++ ) {
        centers[i] = {
            x: Math.floor( Math.random() * 100 ),
            y: Math.floor( Math.random() * 100 )
        };
    }

    io.emit( 'communicate', centers );
    setTimeout( updateClients, 1000 );
}
*/