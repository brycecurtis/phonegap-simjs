addService("Battery", function() {

	var currentLevel = 90;
	var isPlugged = false;
	var callback = "";
	
	// Get battery info
	var getBatteryInfo = function() {
		var r = {isPlugged: isPlugged, level: currentLevel};
		return r;
	};
	
	// Public
	// Called by UI to send change in battery pluggedIn to device
	this.onChange = function(value) {
		console.log("*** ONCHANGE="+value);
		isPlugged = value;
		if (callback) {
			sendResult(new PluginResult(callback, PluginResultStatus.OK, getBatteryInfo(), true));
		}
		localStorage.batteryIsPlugged = value;
	};
	
	// Public
	// Handle requests 
	this.exec = function(action, args, callbackId) {
		if (action=='start') {
			callback = callbackId;
			var r = getBatteryInfo();
			return new PluginResult(callbackId, PluginResultStatus.OK, r, true); // keep callback
		}
		else if (action=='stop') {
			var r = getBatteryInfo();
			var cb = callbackId;
			callbackId = "";
			return new PluginResult(cb, PluginResultStatus.OK, r, false);			
		}
		return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
		//dojo.require("dijit.form.HorizontalSlider");
		
		// Retrieve settings from local storage
		isPlugged = localStorage.batteryIsPlugged === "true";
		currentLevel = localStorage.batteryLevel;
		if (!currentLevel) {
			currentLevel = 90;
		}
		if (isPlugged) {
			dojo.byId("pluggedIn").checked = isPlugged;
		}
		
		// Set initial values
		dijit.byId("horizontalSlider").onChange = function(value) {
			currentLevel = value;
			dojo.byId("batteryLevel").innerHTML = currentLevel+"%";
			if (callback) {
				sendResult(new PluginResult(callback, PluginResultStatus.OK, getBatteryInfo(), true));
			}
			localStorage.batteryLevel = currentLevel;
		}
		dijit.byId("horizontalSlider").attr('value', currentLevel);
		//getBatteryInfo();
	}

});
