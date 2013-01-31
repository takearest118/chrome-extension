chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == 'loading') {
		if(/^http[s]?:\/\/www\.google\.co(?:m|\.[a-z]+)(\/webhp|\/search|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "js/search_google_injection.js"});
		}else if(/^http?:\/\/search\.naver\.co(?:m|\.[a-z]+)(\/search\.naver|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "js/search_naver_injection.js"});
		}else if(/^http?:\/\/search\.daum\.net(\/search|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "js/search_daum_injection.js"});
		}
	}
});

function checkLogin() {
	var api = 'http://www.wish.com/api/search';		// TODO it needs to exchange api for notification count
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState != 4) return;
		//if(xhr.status != 200) return;				// TODO must be 400 error code
		var results = JSON.parse(xhr.response);
		if(results.noti_count == undefined) {
			//var facebook_app_url = 'http://www.facebook.com/apps/application.php?id=227791440613076';
			//chrome.tabs.create({'url': facebook_app_url});
			var wish_logout_url = 'http://www.wish.com/?logout_reason=1';
			chrome.tabs.create({'url': wish_logout_url});
		}else {
		}
	}
	xhr.open("GET", api, true);
	xhr.send();
}

chrome.browserAction.onClicked.addListener(function(tab) {
	checkLogin();
});

chrome.contextMenus.create({
	"title": "Add to Wish",
	"contexts": ["page", "selection", "image", "link"],
	"onclick": clickHandler
});

function clickHandler(info, tab) {
	if(info.mediaType == "image") {
		var wish_bookmarklet_url = "https://www.wish.com/bookmarklet?url=" + info.pageUrl + "&img=" + info.srcUrl + "&is_chrome=True";
		chrome.windows.create({'url': wish_bookmarklet_url, 'top': 200, 'left': 200, 'width': 750, 'height': 683, 'focused': true});
	}else {
		alert("Not selected image");
	}
}

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
