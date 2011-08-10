addService("Capture", function() {

	// Public
	// Handle requests 
	this.exec = function(action, callbackId, args) {
		console.log("Capture."+action+"()");
		alert("Capture API not implemented yet");
		return new PluginResult(callbackId, PluginResultStatus.OK, "NOT IMPLEMENTED", false);
		//return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
   
	}
});
