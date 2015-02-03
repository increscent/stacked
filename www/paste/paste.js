var paste_data = document.getElementById('paste-data');

function remove_html_tags(data) {
	data = data.replace(new RegExp('<', 'g'), '&lt;');
	data = data.replace(new RegExp('>', 'g'), '&gt;');
	return data;
}

paste_data.innerHTML = remove_html_tags(paste_data.innerHTML);