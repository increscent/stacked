function remove_html_tags(data) {
	data = data.replace(new RegExp('<', 'g'), '&lt;');
	data = data.replace(new RegExp('>', 'g'), '&gt;');
	return data;
}