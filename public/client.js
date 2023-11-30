let socketUrl;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  socketUrl = 'ws://localhost:443';
} else {
  socketUrl = 'https://ksnserver.onrender.com:443';
}

var socket = io( socketUrl );

// socket.on( "connect", () => {
//     console.log( "CONNECTED !" );
//     socket.emit( 'joining' );
//     socket.on( 'communicate' , (data) => {
//         document.getElementById( 'mainText' ).text = JSON.stringify(data);
//       });
// } );

var timeStep = 200;

setTimeout( askServer, timeStep );
function askServer() {
  socket.emit( 'askInfo', Date.now() );
  socket.on( 'answerInfo' , (data) => {
    document.getElementById( 'mainText' ).text = data;
  });
  setTimeout( askServer, timeStep );
}