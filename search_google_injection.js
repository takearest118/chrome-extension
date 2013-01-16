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
		wt.setAttribute("style", "display: block; padding: 12px; background: #fafafa; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;");

		var header = document.createElement("div");
		header.setAttribute("id", "wishHeader");
		header.setAttribute("style", "padding: 0 0 10px 0; background-repeat: no-repeat; background-position: right top; background-image: url('"+ chrome.extension.getURL("icon.png") +"');");
		var a = document.createElement("a");
		a.setAttribute("href", "http://www.wish.com/search/" + search_keyword);
		a.setAttribute("style", "text-decoration: none; font-weight: bolder; font-size: medium; color: #3a73b6;");
		a.appendChild(document.createTextNode("Found " + result.data.num_found + " results on Wish"));
		header.appendChild(a);
		wt.appendChild(header);

		var body = document.createElement("div");
		body.setAttribute("id", "wishBody");
		body.setAttribute("style", "vertical_align: middle;");
		wt.appendChild(body);

		var ul = document.createElement("ul");
		ul.setAttribute("style", "display: initial; padding:5px; vertical_align: middle;");
		body.appendChild(ul);

		for(var i=0; i<5; i++) {
			if(result.data.results[i]) {
				ul.appendChild(itemtag("http://www.wish.com/search/" + search_keyword + "#cid="+result.data.results[i].id, result.data.results[i].small_picture));
			}
		}
		/*
		for(var idx in result.data.results) {
			ul.appendChild(itemtag("http://www.wish.com/search/" + search_keyword + "#cid="+result.data.results[idx].id, result.data.results[idx].small_picture));
			//ul.appendChild(itemtag("http://www.wish.com/#cid="+result.data.results[idx].id, result.data.results[idx].display_picture));
			//ul.appendChild(itemtag("http://www.wish.com/#cid="+result.data.results[idx].id, result.data.results[idx].img_url));
		}
		*/

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
		xhr.open("GET", "http://www.wish.com/api/search?query="+p['q']+"&transform=true", false);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status = 200) {
					var results = JSON.parse(xhr.response);
					if(results.data.num_found) { 
						//$("#center_col").hide();
						//$("#center_col").load(chrome.extension.getURL("wishblock.html"), null, function() { $("#center_col").fadeIn(1000); });
						//var e = document.getElementById("center_col");
						//e.insertBefore(wishtag(results), e.firstChild);

						$("#center_col").prepend(wishtag(p['q'], results));
					}
				}
			}
		};

		xhr.send();
	}
})();
