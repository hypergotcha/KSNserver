const socket = io( 'ws://localhost:5000' );
socket.on( "connect", () => {
    console.log( "CONNECTED !" );
    socket.emit( 'numClients' );
    socket.on( 'numClientsResponse' , (data) => {
        document.getElementById( 'mainText' ).text = data;
      });
} );