dumpObj = function(obj, name, indent, depth) {
    if (!indent) {
        indent = "  ";
    }
    if (!depth) {
        depth = 1;
    }
    if (!name) {
        name = "Obj";
    }
    if (depth > 10) {
        return indent + name + ": <Maximum Depth Reached>\n";
    }
    if (typeof obj == "object") {
        var child = null;
        var output = indent + name + "\n";
        indent += "\t";
        var item;
        for (item in obj) {
            var child = '';
            try {
                child = obj[item];
            } catch (e) {
                child = "<Unable to Evaluate>";
            }
            if (typeof child == "object") {
                if (depth > 1) {
                    output += dumpObj(child, item, indent, depth - 1);
                }
            } else {
                output += indent + item + ": " + child + "\n";
            }
        }
        return output;
    } else {
        //console.log("type=else");
        return obj;
    }
};


var webdb = function() {
	this.db = null;
};

/**
 * Open database
 */
webdb.prototype.open = function(callback) {
	var dbSize = 15 * 1024 * 1024; // 15MB
	this.db = openDatabase('File', '1.0', 'Filesystem', dbSize);
	if (this.db === null) {
		databaseOutput("File system database could not be opened.");
	}
	this.createTable(callback);
};

/**
 * Create files table
 */
webdb.prototype.createTable = function(callback) {
	this.db.transaction(function(tx) {
	    //tx.executeSql('DROP TABLE IF EXISTS file', []);
	    tx.executeSql('CREATE TABLE IF NOT EXISTS file (name TEXT PRIMARY KEY, content TEXT, modified DATETIME)', [],
	    	function(tx, r) {
	    		console.log("Success create: "); //+dumpObj(r,'', ' ',1));
	    		callback();
	    	},
	    	function(tx, e) {
	    		console.log("Error create: "+dumpObj(e, '', ' ', 1));
	    	}
	    );
	});
};

/**
 * Write file
 */
webdb.prototype.write = function(name, content, callback) {
	this.db.transaction(function(tx){
	    var modified = new Date();
	    tx.executeSql('UPDATE file SET content=?, modified=? WHERE name=?', [content, modified, name],
	    	function(tx, r) {
	    		console.log("Success update:"); //+dumpObj(r,'', ' ',1));
	    		if (r.rowsAffected == 1) {
	    			callback();
	    		}
	    		else {
	    			console.log("Try insert...");
	    			tx.executeSql('INSERT INTO file (name, content, modified) VALUES (?,?,?)', // WHERE name="'+name+'"', 
	    				[name, content, modified], //[name, content, modified, name],
	    				function(tx, r) {
	    					console.log("Success write: "); //+dumpObj(r,'', ' ',1));
	    					callback();
	    				},
	    				function(tx, e) {
	    					console.log("Error write: "+dumpObj(e,'', ' ',1));
	    				}
	    			);
	    		}
	    	},
	    	function(tx, e) {
	    		console.log("Error write: "+dumpObj(e,'', ' ',1));
	    	}
	    );
	});
};

/**
 * Read file
 */
webdb.prototype.read = function(name, callback) {
	this.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM file WHERE NAME=?", [name], 
			function(tx, rs) {
				var row;
				for (var i=0; i<rs.rows.length; i++) {
					row = rs.rows.item(i);
					//console.log("row="+dumpObj(row,'',' ',1));
				}
				callback(row.content);
	    	},
	    	function(tx, e) {
	    		console.log("Error read: "+dumpObj(e,'', ' ',1));
	    	}
		);
	});
};

/**
 * Dir
 */
webdb.prototype.dir = function(path, callback) {
	this.db.transaction(function(tx) {
		tx.executeSql("SELECT name FROM file WHERE NAME LIKE ? ORDER BY name", [path+"%"], 
			function(tx, rs) {
				var dir = [];
				for (var i=0; i<rs.rows.length; i++) {
					row = rs.rows.item(i);
					//console.log("row="+dumpObj(row,'',' ',1));
					dir.push(row.name);
				}
				callback(dir);
	    	},
	    	function(tx, e) {
	    	}
		);
	});
};

/**
 * Delete file
 */
webdb.prototype.del = function(name, callback) {
	this.db.transaction(function(tx) {
		tx.executeSql("DELETE FROM file WHERE name=?", [name], 
			function(tx, rs) {
				//console.log("rowsAffected="+rs.rowsAffected);
				callback(rs.rowsAffected);
	    	},
	    	function(tx, e) {
	    		console.log("Error deleting: "+dumpObj(e, '', ' ', 1));
	    	}
		);
	});
};

/**
 * Delete all files
 */
webdb.prototype.deleteAll = function(callback) {
	this.db.transaction(function(tx) {
		tx.executeSql("DELETE FROM file", [], 
			function(tx, rs) {
				console.log("rowsAffected="+rs.rowsAffected);
				callback(rs.rowsAffected);
	    	},
	    	function(tx, e) {
	    		console.log("Error deleting all: "+dumpObj(e, '', ' ', 1));
	    	}
		);
	});	
};

webdb.prototype.test = function() {
	var me = this;
	me.del("file1", function(r) {
		console.log("Write file...");
		me.write("dir/file1", "This is content11", function() {
			console.log("Read file...");
			me.read("file2", function(r) {
				console.log("file2="+r);

				console.log("Dir...");
				me.dir("", function(r) {
					console.log("dir="+r);
				});
			});
		});
	});
	
	/*
	console.log("Delete file");
	this.del("file1");
	
	console.log("Read deleted file");
	r = this.read("file1");
	console.log("file1="+r);
	
	console.log("Dir after deleted file");
	r = this.dir("");
	console.log("dir="+r);
*/
};

var db = new webdb();
db.open(function() {
	//db.test();
});
