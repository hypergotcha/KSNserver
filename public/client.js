const socket = io();

// Update the client count when it changes
socket.on( 'stats', ( count ) => {
    console.log('stats', count);
    document.getElementById( 'client-count' ).textContent = "REDIS " + count;
});