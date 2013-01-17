(function() {
	var params = function(url) {
		ret = {};
		var opts = url.split("?")[1].split("&");
		for(var pair in opts) {
			var temp = opts[pair].split("=");
			ret[temp[0]] = temp[1];
		}
		return ret;
	}

	var itemtag = function(link_src, img_src) {
		var img = document.createElement("img");
		img.setAttribute("src", img_src); 

		var a = document.createElement("a");
		a.setAttribute("href", link_src);
		a.setAttribute("target", "_blank");

		var div = document.createElement("div");

		var li = document.createElement("li");
		li.setAttribute("style", "display: inline-block; padding: 5px;");

		li.appendChild(div);
		div.appendChild(a);
		a.appendChild(img);

		return li;
	};

	var wishtag = function(search_keyword, result) {
		var wt = document.getElementById("wishBlock");
		wt = document.createElement("div");
		wt.setAttribute("id", "wishBlock");
		wt.setAttribute("style", "display: block; padding: 20px 20px 16px; background: #fafafa; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;");

		var header = document.createElement("div");
		header.setAttribute("id", "wishHeader");
		header.setAttribute("style", "padding: 0 0 10px 0; background-repeat: no-repeat; background-position: right top; background-image: url('"+ chrome.extension.getURL("logo.png") +"');");
		var a = document.createElement("a");
		a.setAttribute("href", "http://www.wish.com/search/" + search_keyword);
		a.setAttribute("style", "text-decoration: none; font-weight: normal; font-size: medium;");
		a.appendChild(document.createTextNode("Found " + result.data.num_found + " results on Wish"));
		header.appendChild(a);
		wt.appendChild(header);

		var body = document.createElement("div");
		body.setAttribute("id", "wishBody");
		wt.appendChild(body);

		var ul = document.createElement("ul");
		ul.setAttribute("style", "display: initial; padding:5px; vertical_align: middle;");
		body.appendChild(ul);

		for(var i=0; i<8; i++) {
			if(result.data.results[i]) {
				ul.appendChild(itemtag("http://www.wish.com/search/" + search_keyword + "#cid="+result.data.results[i].id, result.data.results[i].small_picture));
			}
		}

		var div = document.createElement("div");
		div.setAttribute("style", "clear:both;");
		wt.appendChild(div);

		return wt;
	}

	if(document.getElementById("wishBlock")) {
	}else {
		var p = params(decodeURIComponent(document.URL));
		var xhr = new XMLHttpRequest();
		// sync request
		xhr.open("GET", "http://www.wish.com/api/search?query="+p['query']+"&transform=true", false);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status = 200) {
					var results = JSON.parse(xhr.response);
					if(results.data.num_found) { 
						$("#content").prepend(wishtag(p['query'], results));
					}
				}
			}
		};

		xhr.send();
	}
})();
