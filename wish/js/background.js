chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == 'loading') {
		if(/^https?:\/\/www\.google\.co(?:m|\.[a-z]+)(\/webhp|\/search|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "js/search_google_injection.js"});
		}else if(/^http?:\/\/search\.naver\.co(?:m|\.[a-z]+)(\/search\.naver|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "js/search_naver_injection.js"});
		}else if(/^http?:\/\/search\.daum\.net(\/search|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "js/search_daum_injection.js"});
		}
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	var facebook_app_url = 'http://www.facebook.com/apps/application.php?id=227791440613076';
	chrome.tabs.create({'url': facebook_app_url});
});

function checkNotification() {
	var api = 'http://www.wish.com/api/search';		// TODO it needs to exchange api for notification count
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState != 4) return;
		//if(xhr.status != 200) return;				// TODO must be 400 error code
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
window.setInterval(checkNotification, 60 * 1000);
