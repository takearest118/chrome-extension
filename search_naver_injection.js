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
		li.setAttribute("style", "display: inline-block;");

		li.appendChild(div);
		div.appendChild(a);
		a.appendChild(img);

		return li;
	};

	var wishtag = function(result) {

		var wt = document.getElementById("wishBlock");
		wt = document.createElement("div");
		wt.setAttribute("id", "wishBlock");
		wt.setAttribute("style", "display: block; padding: 12px; background: #fafafa; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;");

		var h2 = document.createElement("h2");
		h2.appendChild(document.createTextNode("Found "+ result.data.num_found  +" results on Wish"));
		wt.appendChild(h2);

		var ul = document.createElement("ul");
		wt.appendChild(ul);

		for(var idx in result.data.results) {
			ul.appendChild(itemtag("http://www.wish.com/#cid="+result.data.results[idx].id, result.data.results[idx].small_picture));
			//ul.appendChild(itemtag("http://www.wish.com/#cid="+result.data.results[idx].id, result.data.results[idx].display_picture));
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
					var e = document.getElementById("content");
					e.insertBefore(wishtag(results), e.firstChild);
					}
				}
			}
		};

		xhr.send();
	}
})();
