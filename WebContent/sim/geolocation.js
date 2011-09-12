addService("Geolocation", function() {

	var runningId = null;
	
	// Get current geolocation values
	var getGeolocation = function() {
		var r = {};
		r.latitude = dojo.byId("geoLat").value;
		r.longitude = dojo.byId("geoLng").value;
		r.accuracy = dojo.byId("geoAcc").value;
		r.altitude = dojo.byId("geoAlt").value;
		r.heading = dojo.byId("geoHead").value;
		r.speed = dojo.byId("geoVel").value;
		r.altitudeAccuracy = dojo.byId("geoAltAcc").value;
		var d = new Date();
		var t = d.getTime();
		return {coords: r, timestamp: t};
	};

	// Public 
	// Generate next geolocation values 
	this.nextGeolocation = function() {
		dojo.byId("geoLat").value = rand(100);
		dojo.byId("geoLng").value = rand(100);
		dojo.byId("geoAcc").value = rand(100);
		dojo.byId("geoAlt").value = rand(10000);
		dojo.byId("geoAltAcc").value = 1;
		dojo.byId("geoHead").value = rand(360);
		dojo.byId("geoVel").value = rand(100);
	};
	
	// Public
	// Update geolocation and send to device
	this.updateGeolocation = function() {
		this.nextGeolocation();
		var loc = getGeolocation();
		
		// Send update to device if geolocation watch is running
		if (runningId !== null) {
			var r = new PluginResult(runningId, PluginResultStatus.OK, loc, true);
			sendResult(r);
		}
	};

	// Public
	// Handle requests 
	this.exec = function(action, args, callbackId) {
		if (action=='getCurrentLocation') {
			var r = getGeolocation();
			this.nextGeolocation();
			return new PluginResult(callbackId, PluginResultStatus.OK, r, false);
		}
		else if (action=='start') {
			runningId = callbackId;
			var r = getGeolocation();
			return new PluginResult(callbackId, PluginResultStatus.OK, r, true); // keep callbackId			
		}
		else if (action=='stop') {
			runningId = null;
			return new PluginResult(callbackId, PluginResultStatus.OK, r, false);						
		}
		return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
		this.nextGeolocation();    
	}

});