addService("Network Status", function() {

	this.TYPE_UNKNOWN = "unknown";
	this.TYPE_ETHERNET = "ethernet";
	this.TYPE_WIFI = "wifi";
	this.TYPE_2G = "2g";
	this.TYPE_3G = "3g";
	this.TYPE_4G = "4g";
	this.TYPE_NONE = "none";

	var currentState = "offline";
	var callback = "";
	
	// Get network selected in UI
	var getNetwork = function() {
		var el = dojo.byId("networkForm");
		for (var i=0; i<el.networkType.length; i++) {
			if (el.networkType[i].checked) {
				var value = el.networkType[i].value;
				if (value == "none") {
					currentState = "offline";
				}
				else {
					currentState = "online";
				}
				return el.networkType[i].value;
			}
		}
	};
	
	// Public
	// Called by UI to send change in network status to device
	this.onChange = function(value) {
		sendResult(new PluginResult(callback, PluginResultStatus.OK, value, true));
	};
	
	// Public
	// Handle requests 
	this.exec = function(action, args, callbackId) {
		if (action=='getConnectionInfo') {
			callback = callbackId;
			var r = getNetwork();
			return new PluginResult(callbackId, PluginResultStatus.OK, r, true); // keep callback
		}
		return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
		getNetwork();
	}

});
