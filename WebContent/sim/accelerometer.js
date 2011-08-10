addService("Accelerometer", function() {

	// Get current acceleration values
	var getAcceleration = function() {
		console.log("--- getAcceleration()");
		var r = {};
		r.x = +(dojo.byId("accelX").value);
		r.y = +(dojo.byId("accelY").value);
		r.z = +(dojo.byId("accelZ").value);
		return r;
	};

	// Public 
	// Generate next acceleration values 
	this.nextAccel = function() {
		console.log("--- nextAccel()");
		dojo.byId("accelX").value = rand(10);
		dojo.byId("accelY").value = rand(10);
		dojo.byId("accelZ").value = rand(10);
	};

	// Public
	// Handle requests 
	this.exec = function(action, callbackId, jsonArgs) {
		if (action=='getAcceleration') {
			var r = getAcceleration();
			this.nextAccel();
			return new PluginResult(callbackId, PluginResultStatus.OK, r, false);
		}
		return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
		this.nextAccel();    
	}
});
