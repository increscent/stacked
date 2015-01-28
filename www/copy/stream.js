var webSocket = new WebSocket('ws://localhost:1921', 'source');

webSocket.onopen = function (event) {
	webSocket.send(JSON.stringify({type: 'update', data: 'hi'}));
	setTimeout(function () {
		webSocket.send(JSON.stringify({type: 'add', name: 'whatever', title: 'Whatever', data: 'hello'}));
	}, 1000);
	// setTimeout( function () {
	// 	webSocket.send(JSON.stringify({type: 'update', data: 'what\'s up!'}));
	// }, 2000);
};