(function() {
	//var jquery_script = document.createElement("script");
	//jquery_script.type = "text/javascript";
	//jquery_script.src = "http://code.jquery.com/jquery-1.8.3.min.js";
	//document.getElementsByTagName("head")[0].appendChild(jquery_script);

	var params = function(url) {
		ret = {};
		var opts = url.split("?")[1].split("&");
		for(var pair in opts) {
			var temp = opts[pair].split("=");
			ret[temp[0]] = temp[1];
		}
		return ret;
	}

	var wishtag = function() {
		var wt = document.createElement("div");
		wt.setAttribute("id", "wishBlock");
		wt.setAttribute("style", "display: block; padding: 12px; background: #fafafa; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;");
		
		var h2 = document.createElement("h2");
		h2.appendChild(document.createTextNode("Found xxxx things on Wish"));
		wt.appendChild(h2);

		var ul = document.createElement("ul");
		wt.appendChild(ul);

		var div = document.createElement("div");
		div.setAttribute("style", "clear:both;");
		wt.appendChild(div);

		return wt;
	}

	if(document.getElementById("wishBlock")) {
		alert("exist <wishBlock>");
	}else {
		var p = params(document.URL);
		console.log(p['q']);

		var xhr = new XMLHttpRequest();
		// sync request
		xhr.open("GET", "http://www.wish.com/search/"+encodeURIComponent(p['q']), false);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status = 200) {
					console.log(xhr.response);
				}
			}
		};

		xhr.send();

		var e = document.getElementById("center_col");
		e.insertBefore(wishtag(), e.firstChild);
		alert("google check routine");
	}
})();
