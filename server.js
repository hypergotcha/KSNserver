const port = 5000;
const express = require( "express" );
const { createServer } = require( "http" );
const { Server } = require( "socket.io" );

const app = express();
const httpServer = createServer( app );
const io = new Server( httpServer );

io.on( "connect", ( socket ) => {
    console.log( "socket", socket );
} );

httpServer.listen( port );