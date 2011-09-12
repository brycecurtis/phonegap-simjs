addService("Contacts", function() {

	// Public
	// Handle requests 
	this.exec = function(action, args, callbackId) {
		console.log("Contacts."+action+"()");
		alert("Contacts API not implemented yet");
		return new PluginResult(callbackId, PluginResultStatus.OK, "NOT IMPLEMENTED", false);
		//return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
   
	}
});
