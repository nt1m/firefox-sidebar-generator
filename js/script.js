var FxSidebarGenerator = {
	baseURL: location.href.substring(0, location.href.lastIndexOf('/')),
	icons: {
		16: "/img/undefined-16.png",
		32: "/img/undefined-32.png",
		64: "/img/undefined-64.png"
	},
	dom: {
		form: $("#sidebar-form"),
		inputs: {
			name: $("#sidebar-name"),
			url: $("#sidebar-url"),
			workerURL: $("#worker-url"),
			shareURL: $("#share-url")
		}
	},
	getJSONData: function() {
		var data = {};
		data.name = this.dom.inputs.name.value;
		data.iconURL = this.icons["16"];
		data.icon32URL = this.icons["32"];
		data.icon64URL = this.icons["64"];
		data.sidebarURL = this.dom.inputs.url.value;

		data.description = "Sidebar created by Firefox Sidebar Generator";
		data.author = "Tim Nguyen";
		data.homepageURL = location.href;
		data.origin = this.dom.inputs.url.value;

		if (this.dom.inputs.workerURL.value != "") {
			data.workerURL = this.dom.inputs.workerURL.value;
		}

		if(this.dom.inputs.shareURL.value != "") {
			data.shareURL = this.dom.inputs.shareURL.value;
		}

		return data;
	},
	addSidebar: function(data, node) {
		var uMatch = navigator.userAgent.match(/Firefox\/(.*)$/),
			ffVersion;
		if (uMatch && uMatch.length > 1) {
			ffVersion = uMatch[1];
		}
		var event = new CustomEvent("ActivateSocialFeature");
		if (parseInt(ffVersion) == 21) {
			document.dispatchEvent(event); // required for fx21
		}
		else {
			node.setAttribute("data-service", JSON.stringify(data));
			node.dispatchEvent(event);
		}
	},
	setIcon: function(file, size, parent) {
		readFile({
			"file": file,
			"type": "dataURL",
			"onSuccess": function(url) {
				this.icons[size] = url;
				parent.setAttribute("selected","true");
				parent.style.backgroundImage = "url("+url+")";
			}.bind(this)
		});
	},
	init: function() {
		this.dom.form.addEventListener("submit", function() {
			this.addSidebar(this.getJSONData(), this.dom.form)
		}.bind(this));
	}
}
function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}
function readFile(parameters){
	var file = parameters.file;
	var type = parameters.type;
	var onSuccess = parameters.onSuccess;
	var onError = parameters.onError; //optional
	var reader = new FileReader;
	reader.addEventListener("load", function (result){
		try {
			onSuccess(result.currentTarget.result)
		}
		catch (err){
			if (onError){
				onError(err);
			}
		}
	});
	if (type == "text") {
		reader.readAsText(file);
	}
	else if (type == "dataURL") {
		reader.readAsDataURL(file)
	}
}