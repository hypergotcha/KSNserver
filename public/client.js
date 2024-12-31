const socket = io();

// Update the client count when it changes
socket.on( 'stats', ( data ) => {
    document.getElementById( 'serverStats' ).textContent = data.name + ' [' + data.count + ']';
});