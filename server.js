const port = 5000;

const express = require( "express" );
const app = express();
const http = require( "http" ).createServer(app);
const io = require( "socket.io" )(http);

app.use( express.static( "public" ) );

io.on( "connect", ( socket ) => {
    console.log( "socket", socket );
} );

http.listen( port );