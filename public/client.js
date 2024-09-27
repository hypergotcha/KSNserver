let socketUrl;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  socketUrl = 'ws://localhost:443';
} else {
  socketUrl = 'https://ksnserver.onrender.com:443';
}

socketUrl = 'https://ksnserver.onrender.com:443';

var socket = io( socketUrl );

socket.on( 'connect', () => {
  console.log( "CONNECTED !" );
} );

// Send move to server
function move(direction) {
  socket.emit('move', direction);
}

// Handle server response
socket.on('moveResponse', (data) => {
  document.getElementById('position').innerText = `${data.position.x},${data.position.y}`;
});


// for ( i = 0; i < 1; i++ ) {
//   var socket = io( socketUrl );
//   console.log( i );
// }

// socket.on( "connect", () => {
//     console.log( "CONNECTED !" );
//     socket.emit( 'joining' );
//     socket.on( 'communicate' , (data) => {
//         document.getElementById( 'gameTitle' ).text = JSON.stringify(data);
//       });
// } );
/*
var timeStep = 1000;
let counter = 0;
setTimeout( askServer, timeStep );
function askServer() {
//  socket.emit( 'askInfo2', "> "+counter++ );
  socket.on( 'answerInfo' , (data) => {
    document.getElementById( 'gameTitle' ).text = data;
  });
  setTimeout( askServer, timeStep );
}
*/