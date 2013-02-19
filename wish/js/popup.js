$(document).ready(function() {
	$('a').click(function() {
		chrome.extension.sendRequest({action: this.id});
		window.close();
	});
});
