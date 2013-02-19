var animationFrames = 36;
var animationSpeed = 10;	// ms
var canvas = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');
var loggedInImage = document.getElementById('logged_in');
var rotation = 0;
var loadingAnimation = new LoadingAnimation();

function LoadingAnimation() {
	this.timerId_ = 0;
	this.maxCount = 8;
	this.current_ = 0;
	this.maxDot_ = 4;
}

function ease(x) {
	return (1-Math.sin(Math.PI/2+x*Math.PI))/2;
}

function animateFlip() {
	rotation += 1/animationFrames;
	drawIconAtRotation();

	if(rotation <= 1) {
		setTimeout(animateFlip, animationSpeed);
	}else {
		rotation = 0;
		updateBrowserIcon();
	}
}

function drawIconAtRotation() {
	canvasContext.save();
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	canvasContext.translate(
			Math.ceil(canvas.width/2),
			Math.ceil(canvas.height/2));
	canvasContext.rotate(2*Math.PI*ease(rotation));
	canvasContext.drawImage(
			loggedInImage,
			-Math.ceil(canvas.width/2),
			-Math.ceil(canvas.height/2));
	canvasContext.restore();

	chrome.browserAction.setIcon({imageData: canvasContext.getImageData(0, 0, canvas.width, canvas.height)});
}

function getWishUrl() {
	return 'http://www.wish.com/';
}

function isWishUrl(url) {
	return url.indexOf(getWishUrl()) == 0;
}

function checkLogin() {
	var api = getWishUrl() + 'api/search';		// TODO it needs to exchange api for notification count
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState != 4) return;
		//if(xhr.status != 200) return;				// TODO must be 400 error code
		var results = JSON.parse(xhr.response);
		if(results.noti_count == undefined) {
			//var facebook_app_url = 'http://www.facebook.com/apps/application.php?id=227791440613076';
			//chrome.tabs.create({'url': facebook_app_url});
			chrome.tabs.create({'url': getWishUrl() + '?logout_reason=1'});
		}else {
			chrome.tabs.create({'url': getWishUrl()});
		}
	}
	xhr.open("GET", api, true);
	xhr.send();
}

//Search injection and update browser icon
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == 'loading') {
		if(/^http[s]?:\/\/www\.google\.co(?:m|\.[a-z]+)(\/webhp|\/search|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "js/search_google_injection.js"});
		}else if(/^http?:\/\/search\.naver\.co(?:m|\.[a-z]+)(\/search\.naver|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "js/search_naver_injection.js"});
		}else if(/^http?:\/\/search\.daum\.net(\/search|\/#|\/?$)/.test(tab.url)) {
			chrome.tabs.executeScript(tab.id, {file: "js/search_daum_injection.js"});
		}else if(/^http?:\/\/www\.wish\.com/.test(tab.url)) {
			updateBrowserIcon();
			animateFlip();
		}
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.windows.getCurrent(function(win) {
		chrome.tabs.captureVisibleTab(win.id, {"format": "png"}, function(imgUrl) {
		});
	});
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		for(var i=0, tab; tab = tabs[i]; i++) {
			if(tab.url && isWishUrl(tab.url)) {
				chrome.tabs.update(tab.id, {selected: true});
				return;
			}
		}
		checkLogin();
	});
	updateBrowserIcon();
});

chrome.contextMenus.create({
	"title": "Add to Wish",
	"contexts": ["page", "selection", "image", "link"],
	"onclick": clickHandler
});

function clickHandler(info, tab) {
	if(info.mediaType == "image") {
		var wish_bookmarklet_url = getWishUrl() + "bookmarklet?url=" + info.pageUrl + "&img=" + info.srcUrl + "&is_chrome=True";
		chrome.windows.create({'url': wish_bookmarklet_url, 'focused': true, 'type': 'popup'});
	}else {
		alert("Not selected image");
	}
}

function updateBrowserIcon() {
	var api = getWishUrl() + 'api/search';		// TODO it needs to exchange api for notification count
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState != 4) return;
		//if(xhr.status != 200) return;				// TODO must be 400 error code
		var results = JSON.parse(xhr.response);
		if(results.noti_count == undefined) {
			chrome.browserAction.setIcon({path: "./res/wish_not_logged_in.png"});
			chrome.browserAction.setBadgeBackgroundColor({color: [190, 190, 190, 230]});
			chrome.browserAction.setBadgeText({text: '?'});
		}else {
			chrome.browserAction.setIcon({path: "./res/wish_logged_in.png"});
			chrome.browserAction.setBadgeBackgroundColor({color: [208, 0, 24, 255]});
			chrome.browserAction.setBadgeText({text: results.noti_count+''});
		}
	}
	xhr.open("GET", api, true);
	xhr.send();
}

updateBrowserIcon();
window.setInterval(updateBrowserIcon, 60 * 1000);
