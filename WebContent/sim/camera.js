addService("Camera", function() {    
	var cameraDir = "phonegap/camera/";
	var curCameraImage = "";
	var curAlbumImage = "";

	// Public
	// Set image to return for camera
	this.setCameraImage = function(image) {
		curCameraImage = image;
		document.getElementById("cameraSelectedId").src = cameraDir+curCameraImage;
		document.getElementById("cameraSizeId").innerHTML = image;
	}

	// Public
	// Set image to return for library
	this.setAlbumImage = function(image) {
		curAlbumImage = image;
		document.getElementById("albumSelectedId").src = cameraDir+curAlbumImage;
		document.getElementById("albumSizeId").innerHTML = image;
	}

	// Get image for camera or library
	var getCameraImage = function(source) {
		console.log("camera image="+curCameraImage);
		if (source == 1) {
			return baseUrl+"/"+cameraDir+curCameraImage;
		}
		else {
			return baseUrl+"/"+cameraDir+curAlbumImage;
		}
	}

	// Public
	// Handle requests 
	this.exec = function(action, callbackId, args) {
		// [quality, destinationType, sourceType, targetWidth, targetHeight, encodingType]
		if (action=='takePicture') {
			var r = getCameraImage(args[2]);
			return new PluginResult(callbackId, PluginResultStatus.OK, r, false);
		}
		return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
		this.setCameraImage("camera1_m.jpg");
		this.setAlbumImage("album1_m.jpg");
	}
});
