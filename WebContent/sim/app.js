addService("App", function() {

	// Public
	// Handle requests 
	this.exec = function(action, args, callbackId) {
		console.log("App."+action+"()");
		return new PluginResult(callbackId, PluginResultStatus.OK, "", false);
		//return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
   
	}
});
