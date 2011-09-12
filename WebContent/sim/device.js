addService("Device", function () {

	/**
	 * Get device properties
	 */
	var getDevice = function() {
		var r = {};
		r.platform = dojo.byId("platform").value;
		r.version = dojo.byId("version").value;
		r.name = "simjs";
		r.uuid = dojo.byId("uuid").value;
		r.phonegap = "0.9.5";
		r.available = true;
		return r;
	};
	
    var getDeviceOrient = function() {
        var el = dojo.byId("deviceOrientForm");
        for (var i=0; i<el.deviceOrient.length; i++) {
            if (el.deviceOrient[i].checked) {
                return el.deviceOrient[i].value;
            }
        }
    }


	/**
	 * Restore settings from storage
	 */
	this.setDevice = function() {
		var platform = localStorage.devicePlatform;
		var version = localStorage.deviceVersion;
		var uuid = localStorage.deviceUuid;
		var width = localStorage.deviceWidth;
		var height = localStorage.deviceHeight;
		var orient = localStorage.deviceOrient;
		dojo.byId("platform").value = platform ? platform : "Android";
		dojo.byId("version").value = version ? version : "2.2";
		dojo.byId("uuid").value = uuid ? uuid : "UUID";
		dojo.byId("deviceWidth").value = width ? width : 480;
		dojo.byId("deviceHeight").value = height ? height : 800;
		if (orient === 'l') {
			delete dojo.byId("deviceOrientProfile").checked;
			dojo.byId("deviceOrientLandscape").checked = true;
		}
		else {
			dojo.byId("deviceOrientProfile").checked = true;
			delete dojo.byId("deviceOrientLandscape").checked;                      
		}
		this.setDeviceSize();
	};

	/**
	 * Public
	 * Size has changed in UI
	 */
	this.setDeviceSize = function() {
		console.log("setDeviceSize()");
		// New values
		var width = dojo.byId("deviceWidth").value;
		var height = dojo.byId("deviceHeight").value;
		var orient = getDeviceOrient();

		// Current values
		var simulator = dojo.byId("simulator");
		var simheader = dojo.byId("simheader");
		var curWidth = simulator.simWidth;
		var curHeight = simulator.simHeight;
		var curOrient = simulator.simOrient;
		console.log("w,h="+width+","+height+"  cur w,h="+curWidth+","+curHeight);

		// If orientation changed, then we need to fire event
		var fireOrient = false;
		if (curOrient && curOrient != orient) {
			fireOrient = true;
		}

		// If changed, then update
		if ((curWidth != width) || (curHeight != height) || (orient != curOrient)) {
			simulator.simWidth = width;
			simulator.simHeight = height;
			simulator.simOrient = orient;
			if (orient === 'p') {
				simulator.style.width = width+"px";
				simulator.style.height = height+"px";
				simheader.style.width = width+"px";
			}
			else {
				simulator.style.width = height+"px";
				simulator.style.height = width+"px";
				simheader.style.width = height+"px";
			}
			this.saveDevice();
		}
		simulator.style.visibility = "visible";

		// Fire orientation event
		if (fireOrient) {
			fireEvent("orientation")
		}
	};

	/**
	 * Public
	 * Save settings to storage
	 */
	this.saveDevice = function() {
		console.log("saveDevice()");
		localStorage.devicePlatform = dojo.byId("platform").value;
		localStorage.deviceVersion = dojo.byId("version").value;
		localStorage.deviceUuid = dojo.byId("uuid").value;
		localStorage.deviceWidth = dojo.byId("deviceWidth").value;
		localStorage.deviceHeight = dojo.byId("deviceHeight").value;
		localStorage.deviceOrient = getDeviceOrient();
	}

	// Public
	// Handle requests 
	this.exec = function(action, args, callbackId) {
		if (action=='getDeviceInfo') {
			var r = getDevice();
			return new PluginResult(callbackId, PluginResultStatus.OK, r, false);
		}
		return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
		this.setDevice();    
	}

});
