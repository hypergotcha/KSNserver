let socketUrl;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  socketUrl = 'ws://localhost:5000';
} else {
  socketUrl = 'ws://ksnserver.onrender.com/';
}

const socket = io( socketUrl );
socket.on( "connect", () => {
    console.log( "CONNECTED !" );
    socket.emit( 'numClients' );
    socket.on( 'numClientsResponse' , (data) => {
        document.getElementById( 'mainText' ).text = data;
      });
} );