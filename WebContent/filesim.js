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
        //var child = null;
        var output = indent + name + "\n";
        indent += "\t";
        var item = null;
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

/**
 * Simulate filesystem in database
 */
var filedb = function() {
	this.db = null;
};

// Errors
filedb.prototype.ERROR_READ = 1;
filedb.prototype.ERROR_WRITE = 2;
filedb.prototype.ERROR_NOT_FOUND = 3;
filedb.prototype.ERROR_TYPE = 4;
filedb.prototype.ERROR = 5;
	
// File types
filedb.prototype.FILE = 1;
filedb.prototype.DIR = 2;

/**
 * Open database
 */
filedb.prototype.open = function(callback) {
	var dbSize = 15 * 1024 * 1024; // 15MB
	this.db = openDatabase('File', '1.0', 'Filesystem', dbSize);
	if (this.db === null) {
		databaseOutput("File system database could not be opened.");
	}
	this.createTable(callback);
};

/**
 * Create files table
 * 
 * name = filename
 * type = 1=file, 2=dir
 * content = file content
 * modified = modified date
 */
filedb.prototype.createTable = function(callback) {
	this.db.transaction(function(tx) {
	    //tx.executeSql('DROP TABLE IF EXISTS file', []);
	    tx.executeSql('CREATE TABLE IF NOT EXISTS file (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, type INTEGER, content TEXT, size INTEGER, modified DATETIME)', [],
	    	function(tx, r) {
	    		//console.log("Success create: "); //+dumpObj(r,'', ' ',1));
	    		callback();
	    	},
	    	function(tx, e) {
	    		console.log("Error create: "+dumpObj(e, '', ' ', 1));
	    	}
	    );
	});
};

/**
 * Helper to get file name from path
 * 
 * @param {String} path
 * @return {String}
 */
var getFilename = function(path) {
	var i = path.lastIndexOf('/');
	if (i < 1) {
		return path;
	}
	return path.substring(i+1);
};

/**
 * Helper to get parent from file or dir.
 * 
 * @param {String} path
 * @return {String}
 */
var getDir = function(path) {
	var i = path.lastIndexOf('/');
	if (i < 1) {
		return "";
	}
	return path.substring(0, i);
};

/**
 * Write file
 * 
 * @param {String} name				The full path of the file name
 * @param {String} content			The content
 * @param {Function} callback		Is called with number of bytes written
 * @param {Function} fail			Is called with empty
 */
filedb.prototype.write = function(name, content, callback, fail) {
	//console.log("filedb.write("+name+")");
	var me = this;
	this.db.transaction(function(tx){
		
		// Only call success after all mdir & create file successful
		var successCnt = 0;
		var success = function() {
			successCnt++
			if ((successCnt === 2) && callback) {
				//console.log("filedb.write - successfile len="+content.length);
				callback(content.length);
			}
		}
		
		// If any error, then only call fail() once
		var errorCnt = 0;
		var error = function() {
			errorCnt++;
			if ((errorCnt === 1) && fail) {
				fail();
			}
		};
		
		// Create dirs
		var path = getDir(name);
		if (path) {
			me.mkdir(path, success, error);
		}
		
	    var modified = new Date();
	    tx.executeSql('UPDATE file SET content=?, size=?, modified=?, type=? WHERE name=?', [content, content.length, modified, 1, name],
	    	function(tx, r) {
	    		if (r.rowsAffected == 1) {
	    			success();
	    		}
	    		else {
	    			//console.log("Try insert...");
	    			tx.executeSql('INSERT INTO file (name, content, size, type, modified) VALUES (?,?,?,?,?)', // WHERE name="'+name+'"', 
	    				[name, content, content.length, 1, modified], //[name, content, modified, name],
	    				function(tx, r) {
    						success();
	    				},
	    				function(tx, e) {
	    					console.log("Error write: "+dumpObj(e,'', ' ',1));
	    					error();
	    				}
	    			);
	    		}
	    	},
	    	function(tx, e) {
	    		console.log("Error write: "+dumpObj(e,'', ' ',1));
	    		error();
	    	}
	    );
	});
};

/**
 * Create dir and all subdirs
 * 
 * @param {String} name				The dir name
 * @param {Function} callback		Is called with empty
 * @param {Function} fail			Is called with empty
 */
filedb.prototype.mkdir = function(name, callback, fail) {
	//console.log("filedb.mkdir("+name+")");
	if (name) {
		var parts = name.split('/');
		var dir = '';
		var errors = 0;
		var pass = 0;
		for (var i=0; i<parts.length; i++) {
			if (i == 0) {
				dir = parts[i];
			}
			else {
				dir = dir + '/' + parts[i];
			}
			this.cd(dir, function() {
				pass++;
				//console.log("mkdir success: pass="+pass+" len="+parts.length);
				if (pass == parts.length) {
					if (callback) {
						callback();
					}
					return;
				}
			}, function() {
				if (fail) {
					fail();
				}
			});
		}
	}
};

/**
 * Private: Create a dir
 * 
 * @param {String} name				The dir name
 * @param {Function} callback		Is called with empty
 * @param {Function} fail			Is called with empty
 */
filedb.prototype.cd = function(name, callback, fail) {
	//console.log("filedb.cd("+name+")");
	if (name) {
		this.db.transaction(function(tx){
			var modified = new Date();
			tx.executeSql('UPDATE file SET modified=?, type=? WHERE name=?', [modified, 2, name],
					function(tx, r) {
				//console.log("Success update cd:"); //+dumpObj(r,'', ' ',1));
				if (r.rowsAffected == 1) {
					if (callback) {
						callback();
					}
				}
				else {
					//console.log("Try insert...");
					tx.executeSql('INSERT INTO file (name, content, type, modified) VALUES (?,?,?,?)',
							[name, "", filesim.DIR, modified], //[name, content, modified, name],
							function(tx, r) {
						//console.log("Success cd: "); //+dumpObj(r,'', ' ',1));
						if  (callback) {
							callback();
						}
					},
					function(tx, e) {
						console.log("Error cd: "+dumpObj(e,'', ' ',1));
						if (fail) {
							fail();
						}
					}
					);
				}
			},
			function(tx, e) {
				console.log("Error cd: "+dumpObj(e,'', ' ',1));
				if (fail) {
					fail();
				}
			}
			);
		});
	}
};

/**
 * Get file or dir metadata.
 * 
 * @param {String} name				The name
 * @param {Function} callback		Is called with row metadata
 * @param {Function} fail			Is called with error code
 */
filedb.prototype.getFileOrDir = function(name, callback, fail) {
	//console.log("filedb.getFileOrDir("+name+")");
	this.db.transaction(function(tx) {
		tx.executeSql("SELECT id, name, type, size, modified FROM file WHERE NAME=?", [name], 
			function(tx, rs) {
				//console.log("count="+rs.rows.length);
				if (rs.rows.length > 0) {
					callback(rs.rows.item(0));
				}
				else {
					//console.log("file or dir not found " + name);
					fail(filesim.ERROR_NOT_FOUND);
				}
	    	},
	    	function(tx, e) {
	    		console.log("Error getDir: "+dumpObj(e,'', ' ',1));
	    		fail(filesim.ERROR);
	    	}
		);
	});
};

/**
 * Get dir metadata.
 * 
 * @param {String} name				The name
 * @param {Function} callback		Is called with row metadata
 * @param {Function} fail			Is called with error code
 */
filedb.prototype.getDir = function(name, callback, fail) {
	//console.log("filedb.getDir("+name+")");
	this.db.transaction(function(tx) {
		tx.executeSql("SELECT id, name, type, size, modified FROM file WHERE name=? AND type=2", [name], 
			function(tx, rs) {
				//console.log("count="+rs.rows.length);
				if (rs.rows.length > 0) {
					//console.log(" rows="+dumpObj(rs.rows.item(0),'', ' ',1));
					callback(rs.rows.item(0));
				}
				else {
					//console.log("dir not found " + name);
					fail(filesim.ERROR_NOT_FOUND);
				}
	    	},
	    	function(tx, e) {
	    		console.log("Error getDir: "+dumpObj(e,'', ' ',1));
	    		fail(filesim.ERROR);
	    	}
		);
	});
};

/**
 * Read file
 * 
 * @param {String} name
 * @param {Function} callback		Is called with file content
 * @param {Function} fail			Is called with error code
 */
filedb.prototype.read = function(name, callback, fail) {
	//console.log("filedb.read("+name+")");
	this.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM file WHERE NAME=?", [name], 
			function(tx, rs) {
				if (rs.rows.length > 0) {
					var row;
					for (var i=0; i<rs.rows.length; i++) {
						row = rs.rows.item(i);
						//console.log("row="+dumpObj(row,'',' ',1));
					}
					callback(row.content);
				}
				else {
					//console.log(" -- file not found");
					if (fail) fail(filesim.ERROR_NOT_FOUND);
				}
	    	},
	    	function(tx, e) {
	    		console.log("Error read: "+dumpObj(e,'', ' ',1));
	    		if (fail) fail(filesim.ERROR_READ);
	    	}
		);
	});
};

/**
 * Private: Copy a file with minimal error checking.
 * 
 * @param {String} src			The original file to copy
 * @param {String} dest			The new file to create
 * @param {Function} callback	Empty
 * @param {Function} fail		Is called with error code
 */
filedb.prototype.rawCopy = function(src, dest, callback, fail) {
	//console.log("filedb.rawCopy("+src+","+dest+")");
	var me = this;
	me.read(src,
			
		// If src was read, write it to dest
		function(content) {
			me.write(dest, content, callback, function() { if (fail) fail(filesim.ERROR_WRITE);});
		},

		// If src not found
		function() {
			if (fail) fail(filesim.ERROR_NOT_FOUND);
		}
	);
};

/**
 * Private: Move a file with minimal error checking.
 * 
 * @param {String} src			The original file to move
 * @param {String} dest			The dest
 * @param {Function} callback	Empty
 * @param {Function} fail		Is called with error code
 */
filedb.prototype.rawMove = function(src, dest, callback, fail) {
	//console.log("filedb.rawMove("+src+","+dest+")");
    var modified = new Date();
    var me = this;
    
    var error = function(e) {
    	if (fail) fail(e);
    };
    
	// Get the file id
    this.getFileOrDir(src, function(entry) {
		//console.log("entry:"+dumpObj(entry,'', ' ',1));
		
    	// If src is dir, then error
    	if (entry.type === filesim.DIR) {
    		error(filesim.ERROR_TYPE);
    	}
    	
    	// Change filename
    	else {
    		me.db.transaction(
    			function(tx) {
    				tx.executeSql('UPDATE file SET name=?, modified=? WHERE id=?', [dest, modified, entry.id],
    					function(tx, r) {
    						//console.log("Success update:"+dumpObj(r,'', ' ',1));
    						if (r.rowsAffected == 1) {
    							if (callback) callback();
    						}
    						else {
    							error(filesim.ERROR);
    						}
    					},
    					function(tx, e) {
    						console.log("Error rawMove: "+dumpObj(e,'', ' ',1));
    						error(filesim.ERROR);
    					}
    				);
    			},
    			function(tx, e) {
    				console.log("Error1 rawMove: "+dumpObj(e,'', ' ',1));
    				error(filesim.ERROR);
    			}
    		);
    	}
    },
    
    // If src does not exist
    function(e) {
    	error(e);
    });
};

/**
 * Copy a file
 * 
 * @param {String} src			The original file to copy
 * @param {String} dest			The new file to create
 * @param {Function} callback	Empty
 * @param {Function} fail		Is called with error code
 */
filedb.prototype.copyTo = function(src, dest, callback, fail) {
	//console.log("filedb.copyTo("+src+","+dest+")");
	var me = this;
	var destDir = getDir(dest);
	//console.log(" -- destDir="+destDir);
		
	// Error
	var error = function(e) {
		if (fail) fail(e);
	};
	
	// Make sure dest does not exist
	var checkDest = function() {
		//console.log("---checkDest");
		me.getFileOrDir(dest, function(entry) {
			// If dest exists, then error
			//console.log(" -- dest exists, so error"); // @TODO:
			error(0);
		}, function() {
			// If dest does not exist, then copy it
			me.rawCopy(src, dest, callback, function(e) { error(e); });
		});
	};
	
	// Make sure destDir exists
	var checkDestDir = function() {
		//console.log("---checkDestDir");
		if (destDir) {
			me.getFileOrDir(destDir, function(destEntry) {
				
				// If destDir exists
				if (destEntry) {
					
					// If destDir is a file, then error
					if (destEntry.type === filesim.FILE) {
						//console.log(" -- destDir is a file, so error");
						error(filesim.ERROR_TYPE);
					}
					
					// Check dest
					else {
						checkDest();
					}
				}
				
				// If destDir does not exist, error
				else {
					//console.log(" -- destDir does not exist, so error");
					error(filesim.ERROR_NOT_FOUND);
				}
			}, function() {
				//console.log(" -- copyDirTo failed to find destDir "+destDir);
				error(filesim.ERROR_NOT_FOUND);
			});
		}
		// If no destDir, then error
		else {
			//console.log(" -- destDir=null, so error");
			error(filesim.ERROR_NOT_FOUND);
		}
	};
	
	// Get src to verify that it is a file
	me.getFileOrDir(src, function(srcEntry) {
		
		// If src exists
		if (srcEntry) {
			
			// If src is a dir, then error
			if (srcEntry.type === filesim.DIR) {
				//console.log(" -- src exists, but is a dir, not file");
				error(filesim.ERROR_TYPE);
			}
			
			// Check destDir
			else {
				checkDestDir();
			}
		}
		// If src does not exist, error
		else {
			//console.log(" -- src does not exist, so error");
			error(filesim.ERROR_NOT_FOUND);
		}
	}, 
	function() { error(filesim.ERROR); });
};


/**
 * Copy a directory
 * 
 * @param {String} src			The original dir to copy
 * @param {String} dest			The new dir to create
 * @param {Function} callback	Is called with number of files copied
 * @param {Function} fail		Is called with 0=error during read, 1=error during write, 2=already exists
 */
filedb.prototype.copyDirTo = function(src, dest, callback, fail) {
	//console.log("filedb.copyDirTo("+src+","+dest+")");
	var me = this;
	var parentDest = getDir(dest);
	//console.log(" -- parendDest="+parentDest);
	
	// Get list of all files to copy and copy them
	var getList = function() {
		//console.log("---getList");
		me.dir(src, function(rows) {
			var cnt = 0;

			// Call success callback when all files have been copied
			var success = function() {
				cnt++;
				if (cnt == rows.length) {
					//console.log(" -- successfully copied "+cnt+" files");
					if (callback) callback(cnt);
				}
			};

			// src = "data/dir1/dir2"
			// srcFullName = "data/dir1/dir2/file1.txt"
			// srcPos points to              ^
			// srcPartName = "file1.txt"
			var srcPos = src.length+1;

			for (var i=0; i<rows.length; i++) {
				var srcFullName = rows[i].name;
				var srcPartName = srcFullName.substring(srcPos);
				var destFullName = dest + "/" + srcPartName;
				me.rawCopy(srcFullName, destFullName, success, error);
			}
		},
		error);
	};
	
	// Error
	var error = function(e) {
		if (fail) fail(e);
	};
	
	// Make sure dest is not a file
	var checkDest = function() {
		//console.log("---checkDest");
		me.getFileOrDir(dest, function(entry) {
			// If dest exists and is file, then error
			if (entry.type == 1) {
				//console.log(" -- dest is a file, so error");
				error(0);
			}
			else {
				getList();
			}
		}, 
		function() {
			getList();
		});
	};
	
	// Make sure parentDest dir exists first
	var checkParent = function() {
		//console.log("---checkParent ");
		if (parentDest) {
			me.getFileOrDir(parentDest, 
			function(row) {

				// If parentDest is a file, then error
				if (row.type==1) {
					//console.log(" -- parentDest is a file, so error");
					error(0);
				}
				// Check dest
				else {
					checkDest();
				}
			}, 
			function() {
				//console.log(" -- copyDirTo failed to find parentDest dir "+parentDest);
				if (fail) fail(0);
			});
		}
		// If parent is root, then go ahead
		else {
			checkDest();
		}
	};
	
	// Make sure that src dir isn't a file
	me.getFileOrDir(src, function(srcEntry) {
		// If src exists
		if (srcEntry) {
			// If src is a dir, then error
			if (srcEntry.type==1) {
				//console.log(" -- src exists, but is a file, not dir");
				error(0);
			}
			// Check parentDest dir
			else {
				checkParent();
			}
		}
		// If src does not exist, error
		else {
			//console.log(" -- src does not exist, so error");
			error(0);
		}
	}, 
	function() { error(0); });
};

/**
 * Move a file
 * 
 * @param {String} src			The original file to move
 * @param {String} dest			The dest
 * @param {Function} callback	Empty
 * @param {Function} fail		Is called with error code
 */
filedb.prototype.moveTo = function(src, dest, callback, fail) {
	//console.log("filedb.moveTo("+src+","+dest+")");
	var me = this;
	var destDir = getDir(dest);
	//console.log(" -- destDir="+destDir);
		
	// Error
	var error = function(e) {
		if (fail) fail(e);
	};
	
	// Check dest
	var checkDest = function() {
		//console.log("---checkDest");
		me.getFileOrDir(dest, function(entry) {
			
			// If dest exists and is dir, then error
			if (entry.type === filesim.DIR) {
				//console.log(" -- dest exists, so error");
				error(filesim.ERROR_TYPE);
			}
			else {
				// delete existing file
				me.delFile(dest, function() {
				// move
				me.rawMove(src, dest, callback, function(e) { error(e); });				
				});
			}
		}, function() {
			// If dest does not exist, then move it
			me.rawMove(src, dest, callback, function(e) { error(e); });
		});
	};
	
	// Make sure destDir exists
	var checkDestDir = function() {
		//console.log("---checkDestDir");
		if (destDir) {
			me.getFileOrDir(destDir, function(destEntry) {
				// If destDir exists
				if (destEntry) {
					// If destDir is a file, then error
					if (destEntry.type === filesim.FILE) {
						//console.log(" -- destDir is a file, so error");
						error(filesim.ERROR_TYPE);
					}
					// Check dest
					else {
						checkDest();
					}
				}
				// If destDir does not exist, error
				else {
					//console.log(" -- destDir does not exist, so error");
					error(filesim.ERROR_NOT_FOUND);
				}
			}, function() {
				//console.log(" -- moveTo failed to find destDir "+destDir);
				error(filesim.ERROR_NOT_FOUND);
			});
		}
		// If no destDir, then error
		else {
			//console.log(" -- destDir=null, so error");
			error(filesim.ERROR_NOT_FOUND);
		}
	};
	
	// Get src to verify that it is a file
	me.getFileOrDir(src, function(srcEntry) {
		// If src exists
		if (srcEntry) {
			// If src is a dir, then error
			if (srcEntry.type === filesim.DIR) {
				//console.log(" -- src exists, but is a dir, not file");
				error(filesim.ERROR_TYPE);
			}
			// Check destDir
			else {
				checkDestDir();
			}
		}
		// If src does not exist, error
		else {
			//console.log(" -- src does not exist, so error");
			error(filesim.ERROR_NOT_FOUND);
		}
	}, 
	function() { error(filesim.ERROR); });
};

/**
 * Move a directory
 * 
 * @param {String} src			The original dir to move
 * @param {String} dest			The dest dir
 * @param {Function} callback	Is called with number of files moved
 * @param {Function} fail		Is called with error code
 */
filedb.prototype.moveDirTo = function(src, dest, callback, fail) {
	//console.log("filedb.moveDirTo("+src+","+dest+")");
	var me = this;
	var parentDest = getDir(dest);	// parent directory of destination
	//console.log(" -- parentDest="+parentDest);
	
	// Make sure that src is a dir
	me.getFileOrDir(src, 
		function(row) {
		
			// If src is file, then error
			if (row.type === filesim.FILE) {
				//console.log("---src dir exists, but is a file, not dir");
				error(filesim.ERROR_TYPE);
			}
			
			// If src is dir, then continue
			else {
				checkParent();
			}
		}, 
		function() {
			error(filesim.ERROR_NOT_FOUND);
		}
	);

	// Make sure parentDest dir exists
	var checkParent = function() {
		//console.log("---checkParent"); //+dumpObj(row,'', ' ',1));
		
		// If parentDest dir not root
		if (parentDest) {
			me.getFileOrDir(parentDest, 
				function(row) {

					// If parentDest dir is a file, then error
					if (row.type === filesim.FILE) {
						error(filesim.ERROR_TYPE);
					}

					// If it is a dir, then continue
					else {
						checkDest();
					}
				},
				function() {
					//console.log(" -- moveDirTo failed to find parentDest dir "+parentDest);
					error(filesim.ERROR_NOT_FOUND);
				}
			);
		}
		
		// If parentDest dir is root, then continue
		else {
			checkDest();
		}
	};
	
	// Make sure dest is empty if it does
	var checkDest = function() {
		//console.log("---checkDest");
		me.dir(dest,
				
			// If dest exists
			function(rows){
				//console.log(" -- rows="+dumpObj(rows,'', ' ',2));
			
				// If dest empty dir, then continue
				if ((rows.length === 1) && (rows[0].type === filesim.DIR)) {
					getList();
				}
				
				// If not, then error
				else {
					error(filesim.ERROR);
				}
			}, 
			
			// If dest does not exist, then continue
			function(e) {
				getList();
			}
		);
	};

	// Get list of all files to copy and copy them
	var getList = function() {
		//console.log("---getList"); //+dumpObj(row,'', ' ', 1));
		me.dir(src, function(rows) {
			var cnt = 0;

			// src = "data/dir1/dir2"
			// srcFullName = "data/dir1/dir2/file1.txt"
			// srcPos points to              ^
			// srcPartName = "file1.txt"
			var srcPos = src.length+1;

			// Recursively call until all files have been moved
			var update = function() {
				if (cnt == rows.length) {
					//console.log(" -- successfully moved "+cnt+" files");
					if (callback) callback(cnt);
					return;
				}
				me.db.transaction(
					function(tx) {
						//console.log("cnt="+cnt);
						//console.log("rows="+rows);
						var id = rows[cnt].id;
						var srcFullName = rows[cnt].name;
						var srcPartName = srcFullName.substring(srcPos);
						var destFullName = dest;
						if (srcPartName)
							destFullName = dest + "/" + srcPartName;
						//console.log("srcFullName="+srcFullName+" srcPartname="+srcPartName+" destFullName="+destFullName+" id="+id);
						var modified = new Date();
						tx.executeSql('UPDATE file SET name=?, modified=? WHERE id=?', [destFullName, modified, id],
							function(tx, r) {
								//console.log("Success update:"+dumpObj(r,'', ' ',1));
								if (r.rowsAffected == 1) {
									cnt++;
									update();
								}
								else {
									error();
								}
							},
							function(tx, e) {
								console.log("Error rawMove: "+dumpObj(e,'', ' ',1));
								error();
							}
						);
					},
					function(tx, e) {
						console.log("Error1 rawMove: "+dumpObj(e,'', ' ',1));
						error();
					}
				);
			};
			
			// Start moving files
			update();
		},
		error);
	};
	
	// Error
	var error = function(e) {
		if (fail) fail(e);
	};
};

/**
 * List dir
 * 
 * @param {String} path					The dir
 * @param {Function} callback			Is called with metadata[].
 * @param {Function} faile				Is called with error code
 */
filedb.prototype.dir = function(path, callback, fail) {
	//console.log("filedb.dir("+path+")");
	this.db.transaction(function(tx) {
		tx.executeSql("SELECT id, name, type, modified FROM file WHERE NAME LIKE ? ORDER BY name", [path+"%"], 
			function(tx, rs) {
				//console.log(" -- #rows="+rs.rows.length);
				if (rs.rows.length === 0) {
					if (fail) fail(filesim.ERROR_NOT_FOUND);
				}
				var dir = [];
				for (var i=0; i<rs.rows.length; i++) {
					row = rs.rows.item(i);
					//console.log("row="+dumpObj(row,'',' ',1));
					dir.push(row);
				}
				if (callback) {
					callback(dir);
				}
	    	},
	    	function(tx, e) {
	    		if (fail) {
	    			fail(filesim.ERROR);
	    		}
	    	}
		);
	});
};

/**
 * Delete file
 * 
 * @param {String} name				The file name.
 * @param {Function} callback		Is called with the number of entries deleted (0 or 1)
 */
filedb.prototype.delFile = function(name, callback) {
	//console.log("filedb.del("+name+")");	
	this.db.transaction(function(tx) {
		
		tx.executeSql("DELETE FROM file WHERE name=? AND type=1", [name], 
			function(tx, rs) {
				//console.log("rowsAffected="+rs.rowsAffected);
				callback(rs.rowsAffected);
	    	},
	    	function(tx, e) {
	    		console.log("Error deleting: "+dumpObj(e, '', ' ', 1));
	    		callback(0);
	    	}
		);
	});
};

/**
 * Delete directory if empty, or dir + subdirs + files if name ends with wildcard %
 * 
 * @param {String} name				The dir name. Can end in wildcard % to delete all subdirs & files
 * @param {Function} callback		Is called with number of entries deleted
 */
filedb.prototype.delDir = function(name, callback) {
	//console.log("filedb.delDir("+name+")");
	var me = this;
	
	// If wildcard name%, then delete everything under the dir, including the dir
	if (name[name.length-1] == '%') {
		me.db.transaction(function(tx) {
			tx.executeSql("DELETE FROM file WHERE name LIKE ?", [name], 
					function(tx, rs) {
				//console.log("rowsAffected="+rs.rowsAffected);
				if (callback) callback(rs.rowsAffected);
			},
			function(tx, e) {
				//console.log("Error deleting dir "+name+": "+dumpObj(e, '', ' ', 1));
				if (callback) callback(0);
			}
			);
		});
	}
	
	// If deleting a single dir, then it must be empty
	else {
		me.db.transaction(function(tx) {
			tx.executeSql("SELECT COUNT(*) FROM file WHERE NAME LIKE ?", [name+"%"], 
				function(tx, rs) {
					//console.log(" rows="+dumpObj(rs.rows.item(0),'',' ',1));
					var cnt = rs.rows.item(0)["COUNT(*)"];
					//console.log(" -- cnt="+cnt);
					
					// If only dir found, then delete it
					if (cnt == 1) {
						//console.log(" -- empty dir found, so delete it");
						me.db.transaction(function(tx) {
							tx.executeSql("DELETE FROM file WHERE name=? AND type=2", [name], 
								function(tx, rs) {
									//console.log(" -- del dir rowsAffected="+rs.rowsAffected);
									if (callback) callback(rs.rowsAffected);
								},
								function(tx, e) {
									//console.log("Error deleting dir: "+dumpObj(e, '', ' ', 1));
									if (callback) callback(0);
								}
							);
						});
					}
					
					// If not found or not empty
					else {
						if (callback) callback(cnt);
					}
		    	},
		    	function(tx, e) {
		    		if (callback) callback(0);
		    	}
			);
		});
	}
};

/**
 * Delete all files and dirs
 */
filedb.prototype.deleteAll = function(callback) {
	this.db.transaction(function(tx) {
		tx.executeSql("DELETE FROM file", [], 
			function(tx, rs) {
				//console.log("rowsAffected="+rs.rowsAffected);
				callback(rs.rowsAffected);
	    	},
	    	function(tx, e) {
	    		console.log("Error deleting all: "+dumpObj(e, '', ' ', 1));
	    	}
		);
	});	
};

filedb.prototype.test = function() {
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

var filesim = new filedb();
filesim.open(function() {
	//filesim.test();
	filesim.cd("tmp");
	filesim.cd("data");
	filesim.cd("app");
	filesim.cd("resource");
	filesim.dir("", function(r) {
		console.log("dir="+dumpObj(r,'', ' ',2));
	});

});
