document.getElementById('save').addEventListener('click', save);

function save() {
	var name = document.getElementById('name').value;
	var data = document.getElementById('data').value;
	
	ajax_request('POST', '/save', {name: name, data: data}, function (result) {
		result = JSON.parse(result);
		if (result.error) {
			console.log('not gonna happen');
		} else {
			redirect('/' + name);
		}
	});
}

function ajax_request(type, url, data, callback) {
	var request = new XMLHttpRequest();
	
	request.open(type.toUpperCase(), url, true);
	request.setRequestHeader("Content-type","application/json");
	request.onload = function () {
		return callback(request.response);
	};
	if (type.toLowerCase() === 'post') data = JSON.stringify(data);
	request.send(data);
}

function redirect(url) {
	window.location.href = url;
}