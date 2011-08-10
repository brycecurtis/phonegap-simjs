            // File data for tree model 
            filedata = null;
            
            /**
             * Retrieve all files and populate tree control
             */
            function populateTree() {
                filesim.dir("", function(r) {
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
                    
                    // Delete tree wigit 
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
                });
            }
            
            // Load file list into tree 
            dojo.addOnLoad(populateTree);
