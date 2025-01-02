const io = require('socket.io-client');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { AddressInfo } = require('net');
const Client = require('socket.io-client');

describe('Socket.IO Server Tests', () => {
	let ioServer;
	let serverSocket;
	let clientSocket;
	let httpServer;

	beforeAll((done) => {
		httpServer = createServer();
		ioServer = new Server(httpServer);
		httpServer.listen(() => {
			const port = httpServer.address().port;
			clientSocket = Client(`http://localhost:${port}`);
			ioServer.on('connection', (socket) => {
				serverSocket = socket;
			});
			clientSocket.on('connect', done);
		});
	});

	afterAll(() => {
		ioServer.close();
		clientSocket.close();
		httpServer.close();
	});

	test('should return server time when requested', (done) => {
		// Setup listener for time response
		clientSocket.on('timeResponse', (data) => {
			expect(data).toHaveProperty('time');
			// Verify the time is a valid ISO string
			expect(() => new Date(data.time)).not.toThrow();
			// Verify the time is within the last second
			const timeReceived = new Date(data.time);
			const now = new Date();
			expect(now - timeReceived).toBeLessThan(1000);
			done();
		});

		// Emit getTime event
		clientSocket.emit('getTime');
	});
});