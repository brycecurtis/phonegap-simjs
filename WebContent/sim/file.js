addService("File", function() {

	// Public
	// Handle requests 
	this.exec = function(action, args, callbackId) {
		try {
			var r = ""+document.pgFileApplet.exec(action, JSON.stringify(args), callbackId); // force string return
			console.log("FILE.JS RETURNING FROM JAVA="+r);
			return r; // Return a string, since it is already JSON encoded string
		} catch (e) {
			console.log("ERROR: "+e);
		}
	};

	// Initialization 
	{	
		console.log("File initialization");
		// Populate tree widget if not already done within 2 sec of loading page
		populateTreeRun = false;
		setTimeout(function() {
			if (!populateTreeRun) {
				populateTree();
			}
		}, 2000);
	
		// Listen for file applet init complete
		// This may occur before we are initialized and add listener, so 2 sec delay above will do it
		document.addEventListener("fileAppletInit", populateTree);
	}
});

//-----------------------------------------------------------------------------
// Javascript for File UI
//-----------------------------------------------------------------------------

// File data for tree model 
filedata = null;

/**
 * Retrieve all files and populate tree control
 */
function populateTree() {
	console.log("file.js: POPULATE TREE");
	populateTreeRun = true;
	
	// Call applet to get entire filesystem content
	var s = ""+document.pgFileApplet.dir("");
	eval("var r="+s);

	// Build data structure for tree widget
	filedata = [];
	var dirs = {};
	for (var i=0; i<r.length; i++) {
		var f = r[i];
		var obj = {id:f.id};
		if (f.type == 2) {
			obj.children = [];
			obj.label = f.name;
			dirs[f.name] = obj;
		}
		// If root, then push to first level 
		var p = f.name.lastIndexOf("/");
		if (p == -1) {
			filedata.push(obj);
		}
		else {
			var parent = f.name.substring(0, p);
			obj.label = f.name.substring(p+1);
			dirs[parent].children.push(obj);
		}
	}

	// Delete existing tree widget 
	if (dijit.byId("fileTree")){
		dijit.byId("fileTree").destroyRecursive();
	}

	// Create tree widget 
	var store = new dojo.data.ItemFileReadStore({
		data: { identifier: 'id', label : 'label', items: filedata }
	});
	var treeModel = new dijit.tree.ForestStoreModel({ store: store });
	var treeControl = new dijit.Tree({
		model: treeModel,
		showRoot: false 
	}, "fileTree" );

	// Add tree widget to DOM      
	var block = document.getElementById('fileTreeContainer');
	block.innerHTML = "";
	block.appendChild(treeControl.domNode);
	treeControl.startup();
}

// Load file list into tree 
//dojo.addOnLoad(populateTree);
