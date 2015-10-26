/*
Thx to David Loschiavo, zerodarknerdy.com
changed version of his https://github.com/djlosch/apollo w/o GA
*/
var APOLLO = APOLLO || (function() {
	var scriptName = 'apollo.js';
	var defaultID = 'apollo_adblock_placeholder';
	var analytics = {};
	var adblockStatus ='off';
	var _args = {
		'id' : defaultID,
		'sampling' : 100, // percentage of pageviews that we'll test for adblocking
		'verbose' : false, // do you want extra messaging to appear in console.log?
		'timeout' : 100, // ms to wait before checking for ad blocking
	};

	return {
		init : function() {
			// import args
		    var scripts = document.getElementsByTagName("script");
		    var i, j, src, parts, basePath;
		    var found = false;
			for (i = 0; i < scripts.length; i++) {
				src = scripts[i].src;
				if (src.indexOf(scriptName) != -1) {
					found = true;
					parts = src.split('?');
					basePath = parts[0].replace(scriptName, '');
					if (parts[1]) {
						var opt = parts[1].split('&');
						for (j = opt.length-1; j >= 0; --j) {
							var pair = opt[j].split('=');
							_args[pair[0]] = pair[1];
						}
					}
			    	break;
				}
			}
			if (!found) {
				console.log('adblocking analytics script has been renamed, and arguments are not detectable.  please make sure you update "scriptName" in the source');
			}

			// sampling is off by default, but for high traffic sites, you may want to drop this down below 20 or you will hit daily datapoint limits in
			if (_args.sampling < 100) {
				var random = Math.floor((Math.random() * 100) + 1);
				if (random > _args.sampling) {
					_args.test = false;
					if (_args.verbose)
						console.log('skipping adblock test / sampling[' + _args.sampling + '%] rolled[' + random + ']');
					return false;
				}
			}

			if (_args.id == defaultID) {
				if (_args.verbose)
					console.log('using placeholder id[' + defaultID + ']');
				document.body.innerHTML += '<div class="advertisement ad advertising ad_holder" id="' + defaultID + '" style="width:300px;height:250px;background:#CCC;top:-500px;position:absolute;"></div>';
			} else {
				if (_args.verbose)
					console.log('not using placeholder id[' + defaultID + ']');
			}

			return true;
		},
		
		adblocked : function() {
			if (_args.verbose)
				console.log('starting adblock test');
			var tag = document.getElementById(_args.id);
			if ((tag.length < 1) || (tag.clientHeight < 1)) {
				if (_args.verbose)
					console.log('adblock on');
					adblockStatus='on';
				return true;
			}
			if (_args.verbose)
				console.log('adblock off');
				dblockStatus='off';
			return false;
		},

	}
}());

if (APOLLO.init()) {
	setTimeout(function() {
			if (APOLLO.adblocked()) {
				adblockStatus='on';
			} else {
				adblockStatus='off';
			}
			console.log(adblockStatus);
	}, APOLLO.timeout);
}