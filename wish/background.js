chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == 'loading') {
		if(/^https?:\/\/www\.google\.co(?:m|\.[a-z]+)(\/webhp|\/search|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "search_google_injection.js"});
		}else if(/^http?:\/\/search\.naver\.co(?:m|\.[a-z]+)(\/search\.naver|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "search_naver_injection.js"});
		}else if(/^http?:\/\/search\.daum\.net(\/search|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "search_daum_injection.js"});
		}
	}
});

function checkNotification() {
	var api = 'http://www.wish.com/api/search';		// TODO it needs to exchange api for notification count
	var interval = 60;		// seconds

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState != 4) return;
		//if(xhr.status != 200) return;				// TODO must be 400 error code
		window.setInterval(checkNotification, interval * 1000);
		var results = JSON.parse(xhr.response);
		if(results.noti_count == undefined) {
			chrome.browserAction.setBadgeText({text: '0'});
		}else {
			chrome.browserAction.setBadgeText({text: results.noti_count+''});
		}
	}
	xhr.open("GET", api, true);
	xhr.send();
}

checkNotification();
