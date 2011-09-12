addService("FileTransfer", function() {

	// Public
	// Handle requests 
	this.exec = function(action, args, callbackId) {
		try {
			var r = ""+document.pgFileTransferApplet.exec(action, JSON.stringify(args), callbackId); // force string return
			console.log("FILETRANSFER.JS RETURNING FROM JAVA="+r);
			return r; // Return a string, since it is already JSON encoded string
		} catch (e) {
			console.log("ERROR: "+e);
		}
	};

	// Initialization 
	{	
	}
});

