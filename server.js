const port = 443;

const express = require( "express" );
const app = express();
const http = require( "http" ).createServer(app);
const io = require( "socket.io" )(http);

app.use( express.static( "public" ) );

io.on( "connect", ( socket ) => {
    console.log( 'NEW CONNECTION from ', socket.id, ShowNumClients() );
    socket.on( 'disconnect', () => {
        console.log('DISCONNECTION  from: ', socket.id, ShowNumClients() );
    } );
} );

updateClients();
function updateClients() {
    let seconds = new Date().getSeconds();

    if ( process.env.NODE_ENV === 'production' ) {
        seconds = 'Application is SERVER';
    } else {
        seconds = 'Application is LOCALHOST';
    }
 
    io.emit( 'numClientsResponse', seconds );
    setTimeout( updateClients, 1000 );
}

function ShowNumClients() {
    return '(' + io.engine.clientsCount + ')';
}

http.listen( port );
 
if ( process.env.NODE_ENV === 'production' ) {
    console.log("Application is SERVER");
} else {
    console.log("Application is LOCALHOST");
}

