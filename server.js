const port = 5000;

const express = require( "express" );
const app = express();
const http = require( "http" ).createServer(app);
const io = require( "socket.io" )(http);

app.use( express.static( "public" ) );

io.on( "connect", ( socket ) => {
    console.log( 'NEW CONNECTION from ', socket.id, ShowNumClients() );
    socket.on( 'disconnect', () => {
        console.log('DISCONNECTION  from ', socket.id, ShowNumClients() );
    } );
} );

updateClients();
function updateClients() {
    const seconds = new Date().getSeconds();
    io.emit( 'numClientsResponse', seconds );
    setTimeout( updateClients, 1000 );
}

function ShowNumClients() {
    return '(' + io.engine.clientsCount + ')';
}

http.listen( port );