const port = 443;

const express = require( "express" );
const app = express();
const http = require( "http" ).createServer(app);
const io = require( "socket.io" )( http,
    {
        cors: {
            origin: "*",
            credentials: true
        }
    } );

app.use( express.static( "public" ) );

io.on( "connect", ( socket ) => {

    console.log( 'NEW CONNECTION from ', socket.id, ShowNumClients() );

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
        let time = new Date().toISOString();
      console.log(`Received event '${eventName}' from ${socket.id}: at ${time}`, args);
    });
    next();
  });