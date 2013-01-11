chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == 'complete') {
		if(/^https?:\/\/www\.google\.co(?:m|\.[a-z]+)(\/webhp|\/search|\/#|\/?$)/.test(tab.url)) {
			alert("google");
			chrome.tabs.executeScript(tab.id, {file: "search_google_injection.js"});
		}else if(/^http?:\/\/search\.naver\.co(?:m|\.[a-z]+)(\/search\.naver|\/#|\/?$)/.test(tab.url)) {
			alert("naver");
			chrome.tabs.executeScript(tab.id, {file: "search_naver_injection.js"});
		}else if(/^http?:\/\/search\.daum\.net(\/search|\/#|\/?$)/.test(tab.url)) {
			alert("daum");
			chrome.tabs.executeScript(tab.id, {file: "search_daum_injection.js"});
		}
	}
});
