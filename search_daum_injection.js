(function() {
	//var jquery_script = document.createElement("script");
	//jquery_script.type = "text/javascript";
	//jquery_script.src = "http://code.jquery.com/jquery-1.8.3.min.js";
	//document.getElementsByTagName("head")[0].appendChild(jquery_script);

	var wishtag = document.createElement("div");
	wishtag.setAttribute("id", "wishBlock");
	wishtag.setAttribute("style", "display: block; padding: 12px; background: #fafafa; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;");
	
	var h2 = document.createElement("h2");
	h2.appendChild(document.createTextNode("Found xxxx things on Wish"));
	wishtag.appendChild(h2);

	var ul = document.createElement("ul");
	wishtag.appendChild(ul);

	var div = document.createElement("div");
	div.setAttribute("style", "clear:both;");
	wishtag.appendChild(div);

	var e = document.getElementsByClassName("inner_article");
	e[0].insertBefore(wishtag, document.getElementById("netizenColl_top"));
	alert("daum check routine");
})();
