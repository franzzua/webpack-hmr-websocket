/**
 * Created by xamidylin on 2017-05-10.
 */
const WebSocketServerConstructor = require('websocket').server;

module.exports = class WssEventStream {
	constructor(app) {
		this.clients  = [];
		const originalListenFunc = app.listen.bind(app);
		app.listen = (port, succ) => {
			const server = originalListenFunc(port, succ);
			this.init(server);
			return server;
		}
	}

	init(server){
		const wss = new WebSocketServerConstructor({
			httpServer: server,
			autoAcceptConnections: true
		});
		wss.on('connect', conn => this.clients.push(conn));
		wss.on('close', conn => this.clients.splice(this.clients.indexOf(conn), 1));
	}

	publish(msg){
		this.clients.forEach(conn => conn.sendUTF(JSON.stringify(msg)))
	}
}
