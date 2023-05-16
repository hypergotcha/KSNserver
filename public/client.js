let socketUrl;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  socketUrl = 'ws://localhost:443';
} else {
  socketUrl = 'https://ksnserver.onrender.com:443';
}

const socket = io( socketUrl );
socket.on( "connect", () => {
    console.log( "CONNECTED !" );
    socket.emit( 'numClients' );
    socket.on( 'numClientsResponse' , (data) => {
        document.getElementById( 'mainText' ).text = data;
      });
} );