const port = 443;

const express = require( "express" );
const rateLimit = require("express-rate-limit");
const app = express();
const http = require( "http" ).createServer(app);
const io = require( "socket.io" )( http, {
    cors: {
        origin: "*",
        credentials: true
    }
} );

const limiter = rateLimit( {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: "Too many requests from this IP, please try again later",
} );

app.use( express.static( "public" ) );
app.use( limiter );

io.on( "connect", ( socket ) => {

    const clientIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;

    console.log( 'NEW CONNECTION from ', socket.id, "IP:", clientIP, ShowNumClients() );

    socket.on( 'disconnect', () => {
        console.log('DISCONNECTION  from: ', socket.id, ShowNumClients() );
    } );

    socket.on( 'joining', ( data ) => {
        console.log( "JOINED!" );
    } );
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

function ShowNumClients() {
    return '(' + io.engine.clientsCount + ')';
}

http.listen( port );
 
if ( process.env.NODE_ENV === 'production' ) {
    console.log("Application is SERVER OK");
} else {
    console.log("Application is LOCALHOST");
}

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
});