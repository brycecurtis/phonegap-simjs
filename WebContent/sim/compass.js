addService("Compass", function() {
	
	// Get current heading value
	var getHeading = function() {
		var r = dojo.byId("heading").value;
		return r;
	}
	
	// Public 
	// Generate next heading value 
	this.nextHeading = function() {
		dojo.byId("heading").value = rand(360);
	}
	
	// Public
	// Handle requests 
	this.exec = function(action, args, callbackId) {
		if (action=='getHeading') {
			var r = getHeading();
			this.nextHeading();
			return new PluginResult(callbackId, PluginResultStatus.OK, r, false);
		}
		return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
		this.nextHeading();    
	}

});
