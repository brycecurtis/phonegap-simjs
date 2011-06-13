/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010-2011, IBM Corporation
 */

if (!PhoneGap.hasResource("file")) {
PhoneGap.addResource("file");
(function() {
	
	var filesim = parent.filesim;
	
	/**
	 * Helper to get file name from path
	 * 
	 * @param {String} path
	 * @return {String}
	 */
	getFilename = function(path) {
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
	getDir = function(path) {
		var i = path.lastIndexOf('/');
		if (i < 1) {
			return "";
		}
		return path.substring(0, i);
	};
	
	/**
	 * Helper to validate file name
	 * 
	 * @param {String} path
	 * @return {Boolean}
	 */
	validateFile = function(path) {
		//return (/^[^\\\/\:\*\?\"\<\>\|\.]+(\.[^\\\/\:\*\?\"\<\>\|\.]+)+$/.test(path));
		//return (/^[^\\\/\:\*\?\"\<\>\|\.]+$/.test(path));
		if (path.indexOf(":") > -1) return false;
		return true;
	};

	// http://www.webtoolkit.info/javascript-base64.html
	/**
	*
	*  Base64 encode / decode
	*  http://www.webtoolkit.info/
	*
	**/
	 
	var Base64 = {
	 
		// private property
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	 
		// public method for encoding
		encode : function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
	 
			input = Base64._utf8_encode(input);
	 
			while (i < input.length) {
	 
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
	 
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
	 
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
	 
				output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
	 
			}
	 
			return output;
		},
	 
		// public method for decoding
		decode : function (input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
	 
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	 
			while (i < input.length) {
	 
				enc1 = this._keyStr.indexOf(input.charAt(i++));
				enc2 = this._keyStr.indexOf(input.charAt(i++));
				enc3 = this._keyStr.indexOf(input.charAt(i++));
				enc4 = this._keyStr.indexOf(input.charAt(i++));
	 
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
	 
				output = output + String.fromCharCode(chr1);
	 
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
	 
			}
	 
			output = Base64._utf8_decode(output);
	 
			return output;
	 
		},
	 
		// private method for UTF-8 encoding
		_utf8_encode : function (string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
	 
			for (var n = 0; n < string.length; n++) {
	 
				var c = string.charCodeAt(n);
	 
				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
	 
			}
	 
			return utftext;
		},
	 
		// private method for UTF-8 decoding
		_utf8_decode : function (utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
	 
			while ( i < utftext.length ) {
	 
				c = utftext.charCodeAt(i);
	 
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				}
				else if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				}
				else {
					c2 = utftext.charCodeAt(i+1);
					c3 = utftext.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
	 
			}
	 
			return string;
		}
	 
	};
	
/**
 * This class provides some useful information about a file.
 * This is the fields returned when navigator.fileMgr.getFileProperties()
 * is called.
 * @constructor
 */
FileProperties = function(filePath) {
    this.filePath = filePath;
    this.size = 0;
    this.lastModifiedDate = null;
};

/**
 * Represents a single file.
 *
 * @constructor
 * @param name {DOMString} name of the file, without path information
 * @param fullPath {DOMString} the full path of the file, including the name
 * @param type {DOMString} mime type
 * @param lastModifiedDate {Date} last modified date
 * @param size {Number} size of the file in bytes
 */
File = function(name, fullPath, type, lastModifiedDate, size) {
	this.name = name || null;
    this.fullPath = fullPath || null;
	this.type = type || null;
    this.lastModifiedDate = lastModifiedDate || null;
    this.size = size || 0;
};

/** @constructor */
FileError = function() {
   this.code = null;
};

// File error codes
// Found in DOMException
FileError.NOT_FOUND_ERR = 1;
FileError.SECURITY_ERR = 2;
FileError.ABORT_ERR = 3;

// Added by this specification
FileError.NOT_READABLE_ERR = 4;
FileError.ENCODING_ERR = 5;
FileError.NO_MODIFICATION_ALLOWED_ERR = 6;
FileError.INVALID_STATE_ERR = 7;
FileError.SYNTAX_ERR = 8;
FileError.INVALID_MODIFICATION_ERR = 9;
FileError.QUOTA_EXCEEDED_ERR = 10;
FileError.TYPE_MISMATCH_ERR = 11;
FileError.PATH_EXISTS_ERR = 12;

//-----------------------------------------------------------------------------
// File manager
//-----------------------------------------------------------------------------

/** @constructor */
var FileMgr = function() {
};

FileMgr.prototype.getFileProperties = function(filePath) {
    return PhoneGap.exec(null, null, "File", "getFileProperties", [filePath]);
};

FileMgr.prototype.getFileBasePaths = function() {
};

FileMgr.prototype.testSaveLocationExists = function(successCallback, errorCallback) {
    return PhoneGap.exec(successCallback, errorCallback, "File", "testSaveLocationExists", []);
};

FileMgr.prototype.testFileExists = function(fileName, successCallback, errorCallback) {
    return PhoneGap.exec(successCallback, errorCallback, "File", "testFileExists", [fileName]);
};

FileMgr.prototype.testDirectoryExists = function(dirName, successCallback, errorCallback) {
    return PhoneGap.exec(successCallback, errorCallback, "File", "testDirectoryExists", [dirName]);
};

FileMgr.prototype.getFreeDiskSpace = function(successCallback, errorCallback) {
    return PhoneGap.exec(successCallback, errorCallback, "File", "getFreeDiskSpace", []);
};

FileMgr.prototype.writeAsText = function(fileName, data, append, successCallback, errorCallback) {
    PhoneGap.exec(successCallback, errorCallback, "File", "writeAsText", [fileName, data, append]);
};

FileMgr.prototype.write = function(fileName, data, position, successCallback, errorCallback) {
	//console.log("FileMgr.write("+fileName+","+data+","+position+")");
	if (position) {
		this.readAsText(fileName, "UTF-8", function(content) {
			var r = content.substring(0,position)+data+content.substring(position);
			filesim.write(fileName, r, function(cnt) {
				if (cnt === r.length) {
					successCallback(data.length);
				}
				else {
					if (errorCallback) errorCallback();
				}
			}, errorCallback);
		}, errorCallback);
	}
	else {
		filesim.write(fileName, data, successCallback, errorCallback);
	}
};

FileMgr.prototype.truncate = function(fileName, size, successCallback, errorCallback) {
	//console.log("FileMgr.truncate("+fileName+","+size+")");
	var me = this;
	me.readAsText(fileName, "UTF-8", function(content) {
		me.write(fileName, content.substring(0,size), 0, successCallback, errorCallback);
	}, errorCallback);
};

FileMgr.prototype.readAsText = function(fileName, encoding, successCallback, errorCallback) {
	//console.log("FileMgr.readAsText("+fileName+","+encoding+")");
	filesim.read(fileName, successCallback, 
		function(e) {
			//console.log("GOT ERROR="+e);
			if (errorCallback) {
				if (e === filesim.ERROR_NOT_FOUND) {
					var err = new FileError();
					err.code = FileError.NOT_FOUND_ERR;
					errorCallback(err);
				}
				else {
					errorCallback(e);
				}
			}
		});
};

FileMgr.prototype.readAsDataURL = function(fileName, successCallback, errorCallback) {
	//console.log("FileMgr.readAsDataURL("+fileName+")");
	this.readAsText(fileName, "UTF-8", function(content){
		var r = "data:text/plain;base64," + Base64.encode(content);
		if (successCallback) successCallback(r);
	}, errorCallback);
};

PhoneGap.addConstructor(function() {
    if (typeof navigator.fileMgr === "undefined") {
        navigator.fileMgr = new FileMgr();
    }
});

//-----------------------------------------------------------------------------
// File Reader
//-----------------------------------------------------------------------------
// TODO: All other FileMgr function operate on the SD card as root.  However,
//       for FileReader & FileWriter the root is not SD card.  Should this be changed?

/**
 * This class reads the mobile device file system.
 *
 * For Android:
 *      The root directory is the root of the file system.
 *      To read from the SD card, the file name is "sdcard/my_file.txt"
 * @constructor
 */
FileReader = function() {
    this.fileName = "";

    this.readyState = 0;

    // File data
    this.result = null;

    // Error
    this.error = null;

    // Event handlers
    this.onloadstart = null;    // When the read starts.
    this.onprogress = null;     // While reading (and decoding) file or fileBlob data, and reporting partial file data (progess.loaded/progress.total)
    this.onload = null;         // When the read has successfully completed.
    this.onerror = null;        // When the read has failed (see errors).
    this.onloadend = null;      // When the request has completed (either in success or failure).
    this.onabort = null;        // When the read has been aborted. For instance, by invoking the abort() method.
};

// States
FileReader.EMPTY = 0;
FileReader.LOADING = 1;
FileReader.DONE = 2;

/**
 * Abort reading file.
 */
FileReader.prototype.abort = function() {
    var evt;
    this.readyState = FileReader.DONE;
    this.result = null;

    // set error
    var error = new FileError();
    error.code = error.ABORT_ERR;
    this.error = error;

    // If error callback
    if (typeof this.onerror === "function") {
        this.onerror({"type":"error", "target":this});
    }
    // If abort callback
    if (typeof this.onabort === "function") {
        this.oneabort({"type":"abort", "target":this});
    }
    // If load end callback
    if (typeof this.onloadend === "function") {
        this.onloadend({"type":"loadend", "target":this});
    }
};

/**
 * Read text file.
 *
 * @param file          {File} File object containing file properties
 * @param encoding      [Optional] (see http://www.iana.org/assignments/character-sets)
 */
FileReader.prototype.readAsText = function(file, encoding) {
    this.fileName = "";
	if (typeof file.fullPath === "undefined") {
		this.fileName = file;
	} else {
		this.fileName = file.fullPath;
	}

    // LOADING state
    this.readyState = FileReader.LOADING;

    // If loadstart callback
    if (typeof this.onloadstart === "function") {
        this.onloadstart({"type":"loadstart", "target":this});
    }

    // Default encoding is UTF-8
    var enc = encoding ? encoding : "UTF-8";

    var me = this;

    // Read file
    navigator.fileMgr.readAsText(this.fileName, enc,

        // Success callback
        function(r) {
            var evt;

            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileReader.DONE) {
                return;
            }

            // Save result
            me.result = r;

            // If onload callback
            if (typeof me.onload === "function") {
                me.onload({"type":"load", "target":me});
            }

            // DONE state
            me.readyState = FileReader.DONE;

            // If onloadend callback
            if (typeof me.onloadend === "function") {
                me.onloadend({"type":"loadend", "target":me});
            }
        },

        // Error callback
        function(e) {
            var evt;
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileReader.DONE) {
                return;
            }

            // Save error
		    me.error = e;

            // If onerror callback
            if (typeof me.onerror === "function") {
                me.onerror({"type":"error", "target":me});
            }

            // DONE state
            me.readyState = FileReader.DONE;

            // If onloadend callback
            if (typeof me.onloadend === "function") {
                me.onloadend({"type":"loadend", "target":me});
            }
        }
        );
};


/**
 * Read file and return data as a base64 encoded data url.
 * A data url is of the form:
 *      data:[<mediatype>][;base64],<data>
 *
 * @param file          {File} File object containing file properties
 */
FileReader.prototype.readAsDataURL = function(file) {
	this.fileName = "";
    if (typeof file.fullPath === "undefined") {
        this.fileName = file;
    } else {
        this.fileName = file.fullPath;
    }

    // LOADING state
    this.readyState = FileReader.LOADING;

    // If loadstart callback
    if (typeof this.onloadstart === "function") {
        this.onloadstart({"type":"loadstart", "target":this});
    }

    var me = this;

    // Read file
    navigator.fileMgr.readAsDataURL(this.fileName,

        // Success callback
        function(r) {
            var evt;

            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileReader.DONE) {
                return;
            }

            // Save result
            me.result = r;

            // If onload callback
            if (typeof me.onload === "function") {
                me.onload({"type":"load", "target":me});
            }

            // DONE state
            me.readyState = FileReader.DONE;

            // If onloadend callback
            if (typeof me.onloadend === "function") {
                me.onloadend({"type":"loadend", "target":me});
            }
        },

        // Error callback
        function(e) {
            var evt;
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileReader.DONE) {
                return;
            }

            // Save error
            me.error = e;

            // If onerror callback
            if (typeof me.onerror === "function") {
                me.onerror({"type":"error", "target":me});
            }

            // DONE state
            me.readyState = FileReader.DONE;

            // If onloadend callback
            if (typeof me.onloadend === "function") {
                me.onloadend({"type":"loadend", "target":me});
            }
        }
        );
};

/**
 * Read file and return data as a binary data.
 *
 * @param file          {File} File object containing file properties
 */
FileReader.prototype.readAsBinaryString = function(file) {
    // TODO - Can't return binary data to browser.
    this.fileName = file;
};

/**
 * Read file and return data as a binary data.
 *
 * @param file          {File} File object containing file properties
 */
FileReader.prototype.readAsArrayBuffer = function(file) {
    // TODO - Can't return binary data to browser.
    this.fileName = file;
};

//-----------------------------------------------------------------------------
// File Writer
//-----------------------------------------------------------------------------

/**
 * This class writes to the mobile device file system.
 *
 * For Android:
 *      The root directory is the root of the file system.
 *      To write to the SD card, the file name is "sdcard/my_file.txt"
 *
 * @constructor
 * @param file {File} File object containing file properties
 * @param append if true write to the end of the file, otherwise overwrite the file
 */
FileWriter = function(file) {
    this.fileName = "";
    this.length = 0;
	if (file) {
	    this.fileName = file.fullPath || file;
	    this.length = file.size || 0;
	}
    // default is to write at the beginning of the file
    this.position = 0;

    this.readyState = 0; // EMPTY

    this.result = null;

    // Error
    this.error = null;

    // Event handlers
    this.onwritestart = null;	// When writing starts
    this.onprogress = null;		// While writing the file, and reporting partial file data
    this.onwrite = null;		// When the write has successfully completed.
    this.onwriteend = null;		// When the request has completed (either in success or failure).
    this.onabort = null;		// When the write has been aborted. For instance, by invoking the abort() method.
    this.onerror = null;		// When the write has failed (see errors).
};

// States
FileWriter.INIT = 0;
FileWriter.WRITING = 1;
FileWriter.DONE = 2;

/**
 * Abort writing file.
 */
FileWriter.prototype.abort = function() {
    // check for invalid state
	if (this.readyState === FileWriter.DONE || this.readyState === FileWriter.INIT) {
		throw FileError.INVALID_STATE_ERR;
	}

    // set error
    var error = new FileError(), evt;
    error.code = error.ABORT_ERR;
    this.error = error;

    // If error callback
    if (typeof this.onerror === "function") {
        this.onerror({"type":"error", "target":this});
    }
    // If abort callback
    if (typeof this.onabort === "function") {
        this.oneabort({"type":"abort", "target":this});
    }

    this.readyState = FileWriter.DONE;

    // If write end callback
    if (typeof this.onwriteend == "function") {
        this.onwriteend({"type":"writeend", "target":this});
    }
};

/**
 * Writes data to the file
 *
 * @param text to be written
 */
FileWriter.prototype.write = function(text) {
	// Throw an exception if we are already writing a file
	if (this.readyState === FileWriter.WRITING) {
		throw FileError.INVALID_STATE_ERR;
	}

    // WRITING state
    this.readyState = FileWriter.WRITING;

    var me = this;

    // If onwritestart callback
    if (typeof me.onwritestart === "function") {
        me.onwritestart({"type":"writestart", "target":me});
    }

    // Write file
    navigator.fileMgr.write(this.fileName, text, this.position,

        // Success callback
        function(r) {
            var evt;
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // position always increases by bytes written because file would be extended
            me.position += r;
            // The length of the file is now where we are done writing.
            me.length = me.position;

            // If onwrite callback
            if (typeof me.onwrite === "function") {
                me.onwrite({"type":"write", "target":me});
            }

            // DONE state
            me.readyState = FileWriter.DONE;

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend({"type":"writeend", "target":me});
            }
        },

        // Error callback
        function(e) {
            var evt;

            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // Save error
            me.error = e;

            // If onerror callback
            if (typeof me.onerror === "function") {
                me.onerror({"type":"error", "target":me});
            }

            // DONE state
            me.readyState = FileWriter.DONE;

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend({"type":"writeend", "target":me});
            }
        }
        );

};

/**
 * Moves the file pointer to the location specified.
 *
 * If the offset is a negative number the position of the file
 * pointer is rewound.  If the offset is greater than the file
 * size the position is set to the end of the file.
 *
 * @param offset is the location to move the file pointer to.
 */
FileWriter.prototype.seek = function(offset) {
    // Throw an exception if we are already writing a file
    if (this.readyState === FileWriter.WRITING) {
        throw FileError.INVALID_STATE_ERR;
    }

    if (!offset) {
        return;
    }

    // See back from end of file.
    if (offset < 0) {
		this.position = Math.max(offset + this.length, 0);
	}
    // Offset is bigger then file size so set position
    // to the end of the file.
	else if (offset > this.length) {
		this.position = this.length;
	}
    // Offset is between 0 and file size so set the position
    // to start writing.
	else {
		this.position = offset;
	}
};

/**
 * Truncates the file to the size specified.
 *
 * @param size to chop the file at.
 */
FileWriter.prototype.truncate = function(size) {
	// Throw an exception if we are already writing a file
	if (this.readyState === FileWriter.WRITING) {
		throw FileError.INVALID_STATE_ERR;
	}

    // WRITING state
    this.readyState = FileWriter.WRITING;

    var me = this;

    // If onwritestart callback
    if (typeof me.onwritestart === "function") {
        me.onwritestart({"type":"writestart", "target":this});
    }

    // Write file
    navigator.fileMgr.truncate(this.fileName, size,

        // Success callback
        function(r) {
            var evt;
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // Update the length of the file
            me.length = r;
            me.position = Math.min(me.position, r);

            // If onwrite callback
            if (typeof me.onwrite === "function") {
                me.onwrite({"type":"write", "target":me});
            }

            // DONE state
            me.readyState = FileWriter.DONE;

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend({"type":"writeend", "target":me});
            }
        },

        // Error callback
        function(e) {
            var evt;
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // Save error
            me.error = e;

            // If onerror callback
            if (typeof me.onerror === "function") {
                me.onerror({"type":"error", "target":me});
            }

            // DONE state
            me.readyState = FileWriter.DONE;

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend({"type":"writeend", "target":me});
            }
        }
    );
};

/**
 * Information about the state of the file or directory
 *
 * @constructor
 * {Date} modificationTime (readonly)
 */
Metadata = function() {
    this.modificationTime=null;
};

/**
 * Supplies arguments to methods that lookup or create files and directories
 *
 * @constructor
 * @param {boolean} create file or directory if it doesn't exist
 * @param {boolean} exclusive if true the command will fail if the file or directory exists
 */
Flags = function(create, exclusive) {
    this.create = create || false;
    this.exclusive = exclusive || false;
};

/**
 * An interface representing a file system
 *
 * @constructor
 * {DOMString} name the unique name of the file system (readonly)
 * {DirectoryEntry} root directory of the file system (readonly)
 */
FileSystem = function() {
    this.name = null;
    this.root = null;
};

/**
 * An interface that lists the files and directories in a directory.
 * @constructor
 */
DirectoryReader = function(fullPath){
    this.fullPath = fullPath || null;
};

/**
 * Returns a list of entries from a directory.
 *
 * @param {Function} successCallback is called with a list of entries
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryReader.prototype.readEntries = function(successCallback, errorCallback) {
	filesim.dir(this.fullPath, function(rows) {
		var entries = [];
		for (var i=0; i<rows.length; i++) {
			if (rows[i].type == 1) {
				var entry = new FileEntry();
				entry.isFile = true;
				entry.isDirectory = false;
				entry.name = getFilename(rows[i].name);
				entry.fullPath = rows[i].name;
				entries.push(entry);
			}
			else {
				var entry = new DirectoryEntry();
				entry.isFile = false;
				entry.isDirectory = true;
				entry.name = getFilename(rows[i].name);
				entry.fullPath = rows[i].name;
				entries.push(entry);
			}
		}
		if (entries.length > 0) {
			if (successCallback) {
				successCallback(entries);
			}
		}
		else {
			if (errorCallback) {
				var err = new FileError();
				err.code = FileError.NOT_FOUND_ERR;
				errorCallback(err);
			}
		}
	}, function() {
		console.log("ReadEntries ERROR unknown");
	});
};

/**
 * An interface representing a directory on the file system.
 *
 * @constructor
 * {boolean} isFile always false (readonly)
 * {boolean} isDirectory always true (readonly)
 * {DOMString} name of the directory, excluding the path leading to it (readonly)
 * {DOMString} fullPath the absolute full path to the directory (readonly)
 * {FileSystem} filesystem on which the directory resides (readonly)
 */
DirectoryEntry = function() {
    this.isFile = false;
    this.isDirectory = true;
    this.name = null;
    this.fullPath = null;
    this.filesystem = null;
};

/**
 * Copies a directory to a new location
 *
 * @param {DirectoryEntry} parentDir the directory to which to copy the entry
 * @param {DOMString} newName the new name of the entry, defaults to the current name
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.copyTo = function(parentDir, newName, successCallback, errorCallback) {
	//console.log("DirectoryEntry.copyTo("+parentDir.fullPath+","+newName+")");
	var newPath = parentDir.fullPath+"/"+newName;
	if (!newName) {
		newPath = parentDir.fullPath+"/"+this.name;
	}
	//console.log(" ==== src="+this.fullPath+" dest="+newPath);
	
	// If invalid dest
	if (!validateFile(newPath)) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.ENCODING_ERR;
			errorCallback(err);	
		}
	}
	
	// If same path, then error
	else if (this.fullPath == newPath) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.INVALID_MODIFICATION_ERR;
			errorCallback(err);	
		}
	}
	
	// If dest is under src, then error
	else if (newPath.indexOf(this.fullPath+"/") == 0) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.INVALID_MODIFICATION_ERR;
			errorCallback(err);	
		}		
	}
	
	else {	
		filesim.copyDirTo(this.fullPath, newPath, function() {
			if (successCallback) {
				var entry = new DirectoryEntry();	
				entry.isFile = false;
				entry.isDirectory = true;
				entry.name = getFilename(newPath);
				entry.fullPath = newPath;
				successCallback(entry);
			}
		}, function(e) {
			console.log("DirectoryEntry.copyTo() error="+e);
			if (errorCallback) {
				var err = new FileError();
				if (e==2) {
					err.code = FileError.INVALID_MODIFICATION_ERR;
				}
				else {
					err.code = FileError.NOT_FOUND_ERR;
				}
				errorCallback(err);
			}
		});
	}
};

/**
 * Looks up the metadata of the entry
 *
 * @param {Function} successCallback is called with a Metadata object
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.getMetadata = function(successCallback, errorCallback) {
	//console.log("DirectoryEntry.getMetadata() for "+this.fullPath);

	filesim.getDir(this.fullPath, function(row) {
		//console.log(" -- ENTIES="+dumpObj(row,'', ' ', 2));
				
		if (successCallback) {
			var data = new Metadata();
			data.modificationTime = new Date(row.modified);
			successCallback(data);
		}
	},
	function() {
		//console.log(" -- No dir found");
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.NOT_FOUND_ERR;
			errorCallback(err);
		}
	});

};

/**
 * Gets the parent of the entry
 *
 * @param {Function} successCallback is called with a parent entry
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.getParent = function(successCallback, errorCallback) {
	//console.log("DirectoryEntry.getParent() for "+this.fullPath);
	var dir = getDir(this.fullPath);
	// Parent of root is root
	if (!dir) {
		dir = this.fullPath;
	}
	filesim.getDir(dir, 

		// If found
		function(row) {
								
			// Call success with dir entry
			if (row.type == 2) {
				if (successCallback) {
					var entry = new DirectoryEntry();
					entry.isFile = false;
					entry.isDirectory = true;
					entry.name = getFilename(row.name);
					entry.fullPath = row.name;
					successCallback(entry);
				}
			}
				
			// Was a file, not a dir, so error
			else {
				if (errorCallback) {
					var err = new FileError();
					err.code = FileError.TYPE_MISMATCH_ERR;
					errorCallback(err);
				}	
			}
		},
		// If not found
		function() {
			if (errorCallback) {
				var err = new FileError();
				err.code = FileError.NOT_FOUND_ERR;
				errorCallback(err);
			}	
		}
	);

};

/**
 * Moves a directory to a new location
 *
 * @param {DirectoryEntry} parentDir the directory to which to move the entry
 * @param {DOMString} newName the new name of the entry, defaults to the current name
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.moveTo = function(parentDir, newName, successCallback, errorCallback) {
	//console.log("DirectoryEntry.moveTo("+parentDir.fullPath+","+newName+")");
	var newPath = parentDir.fullPath+"/"+newName;
	if (!newName) {
		newPath = parentDir.fullPath+"/"+this.name;
	}
	//console.log(" ==== src="+this.fullPath+" dest="+newPath);
	
	// If invalid dest
	if (!validateFile(newPath)) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.ENCODING_ERR;
			errorCallback(err);	
		}
	}
	
	// If same path, then error
	else if (this.fullPath == newPath) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.INVALID_MODIFICATION_ERR;
			errorCallback(err);	
		}
	}
	
	// If dest is under src, then error
	else if (newPath.indexOf(this.fullPath+"/") == 0) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.INVALID_MODIFICATION_ERR;
			errorCallback(err);	
		}		
	}
	
	else {	
		filesim.moveDirTo(this.fullPath, newPath, function() {
			if (successCallback) {
				var entry = new DirectoryEntry();	
				entry.isFile = false;
				entry.isDirectory = true;
				entry.name = getFilename(newPath);
				entry.fullPath = newPath;
				successCallback(entry);
			}
		}, function(e) {
			//console.log("DirectoryEntry.moveTo() error="+e);
			if (errorCallback) {
				var err = new FileError();
				if (e==5) {
					err.code = FileError.INVALID_MODIFICATION_ERR;
				}
				else {
					err.code = FileError.NOT_FOUND_ERR;
				}
				errorCallback(err);
			}
		});
	}
};

/**
 * Removes the entry
 *
 * @param {Function} successCallback is called with no parameters
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.remove = function(successCallback, errorCallback) {
	//console.log("DirectoryEntry.remove() for "+this.fullPath);
	
	// If deleting root, then error
	if ((this.fullPath=='tmp') || (this.fullPath=='data') || (this.fullPath=='app') || (this.fullPath=='resource')) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.NO_MODIFICATION_ALLOWED_ERR;
			errorCallback(err);	
		}
	}

	else {
		filesim.delDir(this.fullPath, 
		function(rows){
			if (rows == 1) {
				if (successCallback) {
					successCallback();
				}
			}
			else {
				if (errorCallback) {
					var err = new FileError();
					err.code = FileError.INVALID_MODIFICATION_ERR;
					errorCallback(err);
				}	
			}
		});
	}
};

/**
 * Returns a URI that can be used to identify this entry.
 *
 * @param {DOMString} mimeType for a FileEntry, the mime type to be used to interpret the file, when loaded through this URI.
 * @return uri
 */
DirectoryEntry.prototype.toURI = function(mimeType) {
    return this.fullPath;
};

/**
 * Creates a new DirectoryReader to read entries from this directory
 */
DirectoryEntry.prototype.createReader = function(successCallback, errorCallback) {
    return new DirectoryReader(this.fullPath);
};

/**
 * Creates or looks up a directory
 *
 * @param {DOMString} path either a relative or absolute path from this directory in which to look up or create a directory
 * @param {Flags} options to create or excluively create the directory
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.getDirectory = function(path, options, successCallback, errorCallback) {
	//console.log("DirectoryEntry.getDirectory("+path+")");
	var fullPath = this.fullPath + "/" + path;

	filesim.getDir(fullPath, 

	// If found
	function(row) {
		
		// If exclusive & create, then this is an error since it already exists
		if (options && options.create && options.exclusive) {
			var err = new FileError();
			err.code = FileError.PATH_EXISTS_ERR;
			if (errorCallback) {
				errorCallback(err);
			}
			return;	
		}
		
		// Call success with dir entry
		if (row.type == 2) {
			if (successCallback) {
				var entry = new DirectoryEntry();
				entry.isFile = (row.type == 1);
				entry.isDirectory = (row.type == 2);
				entry.name = getFilename(row.name);
				entry.fullPath = row.name;
				successCallback(entry);
			}
		}
		
		// Was a file, not a dir, so error
		else {
			if (errorCallback) {
				var err = new FileError();
				err.code = FileError.TYPE_MISMATCH_ERR;
				errorCallback(err);
			}	
		}
	},
	// If not found
	function() {
		// If create
		if (options && options.create) {
			filesim.mkdir(fullPath,function() {

				// Call success with dir entry
				if (successCallback) {
					var entry = new DirectoryEntry();
					entry.isFile = false;
					entry.isDirectory = true;
					entry.name = getFilename(fullPath);
					entry.fullPath = fullPath;
					successCallback(entry);
				}
				
			},function() {
				console.log("Unknown error GetDirectory()");
			});
		}
		// Else error
		else {
			if (errorCallback) {
				var err = new FileError();
				err.code = FileError.NOT_FOUND_ERR;
				errorCallback(err);
			}	
		}
	});
};

/**
 * Creates or looks up a file
 *
 * @param {DOMString} path either a relative or absolute path from this directory in which to look up or create a file
 * @param {Flags} options to create or excluively create the file
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.getFile = function(path, options, successCallback, errorCallback) {
	//console.log("DirectoryEntry.getFile("+path+")"); // options="+options+" callback="+successCallback);
	var fullPath = this.fullPath + "/" + path;
	filesim.getFileOrDir(fullPath, function(row) {
		
		// If file found
		//console.log(" -- ENTIES="+dumpObj(row,'', ' ', 2));
		
		// If exclusive & create, then this is an error since it already exists
		if (options && options.create && options.exclusive) {
			var err = new FileError();
			err.code = FileError.PATH_EXISTS_ERR;
			if (errorCallback) {
				errorCallback(err);
			}
		}
		
		// If file exists
		else if (row.type == 1) {
			if (successCallback) {
				var entry = new FileEntry();	
				entry.isFile = (row.type == 1);
				entry.isDirectory = (row.type == 2);
				entry.name = getFilename(fullPath);
				entry.fullPath = fullPath;
				successCallback(entry);
			}
		}

		// Was a dir, not a file, so error
		else {
			if (errorCallback) {
				var err = new FileError();
				err.code = FileError.TYPE_MISMATCH_ERR;
				errorCallback(err);
			}	
		}
	},
	
	// File not found
	function() {
		//console.log(" -- No file found: "+fullPath);
		
		// If create flag, then create file
		if (options && options.create) {
			//console.log(" -- Create file "+fullPath);
			filesim.write(fullPath, "", function() {
				if (successCallback) {
					var entry = new FileEntry();
					entry.isFile = true;
					entry.isDirectory = false;
					entry.name = getFilename(path);
					entry.fullPath = fullPath;
					successCallback(entry);
				}
			},
			function() {
				if (errorCallback) {
					errorCallback();
				}
			}
			);
		}
		
		// Else return not found error
		else {
			var err = new FileError();
			err.code = FileError.NOT_FOUND_ERR;
			if (errorCallback) {
				errorCallback(err);
			}
		}
	});
};

/**
 * Deletes a directory and all of it's contents
 *
 * @param {Function} successCallback is called with no parameters
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.removeRecursively = function(successCallback, errorCallback) {
	//console.log("DirectoryEntry.removeRecursively() for "+this.fullPath);
	
	// If deleting root, then error
	if ((this.fullPath=='tmp') || (this.fullPath=='data') || (this.fullPath=='app') || (this.fullPath=='resource')) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.NO_MODIFICATION_ALLOWED_ERR;
			errorCallback(err);	
		}
	}
	
	else {
		filesim.delDir(this.fullPath+"%", function(count) {
			if (count > 0) {
				if (successCallback) {
					successCallback();
				}
			}
			else {
				if (errorCallback) {
					var err = new FileError();
					err.code = FileError.NOT_FOUND_ERR;
					errorCallback(err);
				}
			}
		});
	}
};

/**
 * An interface representing a directory on the file system.
 *
 * @constructor
 * {boolean} isFile always true (readonly)
 * {boolean} isDirectory always false (readonly)
 * {DOMString} name of the file, excluding the path leading to it (readonly)
 * {DOMString} fullPath the absolute full path to the file (readonly)
 * {FileSystem} filesystem on which the directory resides (readonly)
 */
FileEntry = function() {
    this.isFile = true;
    this.isDirectory = false;
    this.name = null;
    this.fullPath = null;
    this.filesystem = null;
};

/**
 * Copies a file to a new location
 *
 * @param {DirectoryEntry} parentDir the directory to which to copy the entry
 * @param {DOMString} newName the new name of the entry, defaults to the current name
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.copyTo = function(parentDir, newName, successCallback, errorCallback) {
	//console.log("FileEntry.copyTo("+parentDir.fullPath+","+newName+")");
	var newPath = parentDir.fullPath+"/"+newName;
	if (!newName) {
		newPath = parentDir.fullPath+"/"+this.name;
	}
	
	// If invalid dest
	if (!validateFile(newPath)) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.ENCODING_ERR;
			errorCallback(err);	
		}
	}

	// If same file, then error
	else if (this.fullPath == newPath) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.INVALID_MODIFICATION_ERR;
			errorCallback(err);	
		}

	}
	
	else {
		filesim.copyTo(this.fullPath, newPath, function() {
			if (successCallback) {
				var entry = new FileEntry();	
				entry.isFile = true;
				entry.isDirectory = false;
				entry.name = getFilename(newPath);
				entry.fullPath = newPath;
				successCallback(entry);
			}
		}, function(e) {
			if (errorCallback) {
				var err = new FileError();
				if (e==2) {
					err.code = FileError.INVALID_MODIFICATION_ERR;
				}
				else {
					err.code = FileError.NOT_FOUND_ERR;
				}
				errorCallback(err);
			}
		});
	}
};

/**
 * Looks up the metadata of the entry
 *
 * @param {Function} successCallback is called with a Metadata object
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.getMetadata = function(successCallback, errorCallback) {
	//console.log("FileEntry.getMetadata() for "+this.fullPath);
	var fullPath = this.fullPath;
	filesim.getFileOrDir(this.fullPath, function(row) {
		//console.log(" -- ENTIES="+dumpObj(row,'', ' ', 2));
				
		// If file exists
		if (row.type == 1) {
			if (successCallback) {
				var data = new Metadata();
				data.modificationTime = new Date(row.modified);
				successCallback(data);
			}
		}

		// Was a dir, not a file, so error
		else {
			if (errorCallback) {
				var err = new FileError();
				err.code = FileError.TYPE_MISMATCH_ERR;
				errorCallback(err);
			}	
		}
	},
	function() {
		//console.log(" -- No file found");
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.NOT_FOUND_ERR;
			errorCallback(err);
		}
	});

};

/**
 * Gets the parent of the entry
 *
 * @param {Function} successCallback is called with a parent entry
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.getParent = function(successCallback, errorCallback) {
	//console.log("FileEntry.getParent() for "+this.fullPath);
	var dir = getDir(this.fullPath);
	filesim.getDir(dir, 

		// If found
		function(row) {
								
			// Call success with dir entry
			if (row.type == 2) {
				if (successCallback) {
					var entry = new DirectoryEntry();
					entry.isFile = false;
					entry.isDirectory = true;
					entry.name = getFilename(row.name);
					entry.fullPath = row.name;
					successCallback(entry);
				}
			}
				
			// Was a file, not a dir, so error
			else {
				if (errorCallback) {
					var err = new FileError();
					err.code = FileError.TYPE_MISMATCH_ERR;
					errorCallback(err);
				}	
			}
		},
		// If not found
		function() {
			if (errorCallback) {
				var err = new FileError();
				err.code = FileError.NOT_FOUND_ERR;
				errorCallback(err);
			}	
		}
	);
};

/**
 * Moves a directory to a new location
 *
 * @param {DirectoryEntry} parentDir the directory to which to move the entry
 * @param {DOMString} newName the new name of the entry, defaults to the current name
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.moveTo = function(parentDir, newName, successCallback, errorCallback) {
	//console.log("FileEntry.moveTo("+parentDir.fullPath+","+newName+")");
	
	var newPath = parentDir.fullPath+"/"+newName;
	if (!newName) {
		newPath = parentDir.fullPath+"/"+this.name;
	}
	
	// If invalid dest
	if (!validateFile(newPath)) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.ENCODING_ERR;
			errorCallback(err);	
		}
	}

	// If same file, then error
	else if (this.fullPath == newPath) {
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.INVALID_MODIFICATION_ERR;
			errorCallback(err);	
		}

	}
	
	else {
		filesim.moveTo(this.fullPath, newPath, function() {
			if (successCallback) {
				var entry = new FileEntry();	
				entry.isFile = true;
				entry.isDirectory = false;
				entry.name = getFilename(newPath);
				entry.fullPath = newPath;
				successCallback(entry);
			}
		}, function(e) {
			if (errorCallback) {
				var err = new FileError();
				if (e==5) {
					err.code = FileError.INVALID_MODIFICATION_ERR;
				}
				else {
					err.code = FileError.NOT_FOUND_ERR;
				}
				errorCallback(err);
			}
		});
	}

};

/**
 * Removes the entry
 *
 * @param {Function} successCallback is called with no parameters
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.remove = function(successCallback, errorCallback) {
	filesim.delFile(this.fullPath, function(rows) {
		if (rows == 1) {
			if (successCallback) {
				successCallback();
			}
		}
		else {
			if (errorCallback) {
				var err = new FileError();
		    	err.code = FileError.NOT_FOUND_ERR;
				errorCallback(err);
			}
		}
	});
};

/**
 * Returns a URI that can be used to identify this entry.
 *
 * @param {DOMString} mimeType for a FileEntry, the mime type to be used to interpret the file, when loaded through this URI.
 * @return uri
 */
FileEntry.prototype.toURI = function(mimeType) {
	return this.fullPath;
};

/**
 * Creates a new FileWriter associated with the file that this FileEntry represents.
 *
 * @param {Function} successCallback is called with the new FileWriter
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.createWriter = function(successCallback, errorCallback) {
    this.file(function(filePointer) {
        var writer = new FileWriter(filePointer);
    
        if (writer.fileName === null || writer.fileName === "") {
            if (typeof errorCallback == "function") {
                errorCallback({
                    "code": FileError.INVALID_STATE_ERR
                });
            }
        }
    
        if (typeof successCallback == "function") {
            successCallback(writer);
        }       
    }, errorCallback);
};

/**
 * Returns a File that represents the current state of the file that this FileEntry represents.
 *
 * @param {Function} successCallback is called with the new File object
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.file = function(successCallback, errorCallback) {
	//console.log("FileEntry.file() for "+this.fullPath);
	var fullPath = this.fullPath;
	filesim.getFileOrDir(this.fullPath, function(row) {
		//console.log(" -- ENTIES="+dumpObj(row,'', ' ', 2));
				
		// If file exists
		if (row.type == 1) {
			if (successCallback) {
				var type = "text/text"; // TODO: based upon file ext
				var file = new File(getFilename(fullPath), fullPath, type, row.modified, row.size);
				successCallback(file);
			}
		}

		// Was a dir, not a file, so error
		else {
			if (errorCallback) {
				var err = new FileError();
				err.code = FileError.TYPE_MISMATCH_ERR;
				errorCallback(err);
			}	
		}
	},
	function() {
		//console.log(" -- No file found");
		if (errorCallback) {
			var err = new FileError();
			err.code = FileError.NOT_FOUND_ERR;
			errorCallback(err);
		}
	});

};

/** @constructor */
LocalFileSystem = function() {
};

// File error codes
LocalFileSystem.TEMPORARY = 0;
LocalFileSystem.PERSISTENT = 1;
LocalFileSystem.RESOURCE = 2;
LocalFileSystem.APPLICATION = 3;

/**
 * Requests a filesystem in which to store application data.
 *
 * @param {int} type of file system being requested
 * @param {Function} successCallback is called with the new FileSystem
 * @param {Function} errorCallback is called with a FileError
 */
LocalFileSystem.prototype.requestFileSystem = function(type, size, successCallback, errorCallback) {
    if (type < 0 || type > 3) {
        if (typeof errorCallback == "function") {
            errorCallback({
                "code": FileError.SYNTAX_ERR
            });
        }
    }
    // If too big
    else if (size > 10000000000) {
    	var err = new FileError();
    	err.code = FileError.QUOTA_EXCEEDED_ERR;
    	errorCallback(err);
    }
    else {
    	
        //PhoneGap.exec(successCallback, errorCallback, "File", "requestFileSystem", [type, size]);
        var name = "temporary";
        var root = new DirectoryEntry();
        root.isFile = false;
        root.isDirectory = true;
        root.name = "tmp";
        root.fullPath = "tmp";
        if (type === 1) {
        	name = "persistent";
            root.name = "data";
            root.fullPath = "data";
        }
        else if (type === 2) {
        	name = "resource";
            root.name = "resource";
            root.fullPath = "resource";
        }
        else if (type === 3) {
        	name = "application";
            root.name = "app";
            root.fullPath = "app";
        }
        successCallback({name:name, root:root});
    }
};

/**
 *
 * @param {DOMString} uri referring to a local file in a filesystem
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
LocalFileSystem.prototype.resolveLocalFileSystemURI = function(uri, successCallback, errorCallback) {
	//console.log("resolveLocalFileSystemURI("+uri+")");
	
	// Get from filesystem
	filesim.getFileOrDir(uri, function(entry) {
		//console.log("resolveLocalFileSystemURI SUCCESS:"+dumpObj(entry,'', ' ',1));
		
		// If dir
		if (entry.type === filesim.DIR) {
			var entry = new DirectoryEntry();
			entry.isFile = false;
			entry.isDirectory = true;
			entry.name = getFilename(uri);
			entry.fullPath = uri;
			if (successCallback) successCallback(entry);
		}
		
		// If file
		else {
			var entry = new FileEntry();
			entry.isFile = true;
			entry.isDirectory = false;
			entry.name = getFilename(uri);
			entry.fullPath = uri;
			if (successCallback) successCallback(entry);			
		}
	},
	function() {
		//console.log("resolveLocalFileSystemURI ERROR");
		var err = new FileError();
    	err.code = FileError.NOT_FOUND_ERR;
    	if (errorCallback) {
    		errorCallback(err);
    	}
	});
};

/**
* This function returns and array of contacts.  It is required as we need to convert raw
* JSON objects into concrete Contact objects.  Currently this method is called after
* navigator.service.contacts.find but before the find methods success call back.
*
* @param a JSON Objects that need to be converted to DirectoryEntry or FileEntry objects.
* @returns an entry
*/
LocalFileSystem.prototype._castFS = function(pluginResult) {
    var entry = null;
    entry = new DirectoryEntry();
    entry.isDirectory = pluginResult.message.root.isDirectory;
    entry.isFile = pluginResult.message.root.isFile;
    entry.name = pluginResult.message.root.name;
    entry.fullPath = pluginResult.message.root.fullPath;
    pluginResult.message.root = entry;
    return pluginResult;
};

LocalFileSystem.prototype._castEntry = function(pluginResult) {
    var entry = null;
    if (pluginResult.message.isDirectory) {
        console.log("This is a dir");
        entry = new DirectoryEntry();
    }
    else if (pluginResult.message.isFile) {
        console.log("This is a file");
        entry = new FileEntry();
    }
    entry.isDirectory = pluginResult.message.isDirectory;
    entry.isFile = pluginResult.message.isFile;
    entry.name = pluginResult.message.name;
    entry.fullPath = pluginResult.message.fullPath;
    pluginResult.message = entry;
    return pluginResult;
};

LocalFileSystem.prototype._castEntries = function(pluginResult) {
    var entries = pluginResult.message;
    var retVal = [];
    for (var i=0; i<entries.length; i++) {
        retVal.push(window.localFileSystem._createEntry(entries[i]));
    }
    pluginResult.message = retVal;
    return pluginResult;
};

LocalFileSystem.prototype._createEntry = function(castMe) {
    var entry = null;
    if (castMe.isDirectory) {
        console.log("This is a dir");
        entry = new DirectoryEntry();
    }
    else if (castMe.isFile) {
        console.log("This is a file");
        entry = new FileEntry();
    }
    entry.isDirectory = castMe.isDirectory;
    entry.isFile = castMe.isFile;
    entry.name = castMe.name;
    entry.fullPath = castMe.fullPath;
    return entry;
};

LocalFileSystem.prototype._castDate = function(pluginResult) {
    if (pluginResult.message.modificationTime) {
        var modTime = new Date(pluginResult.message.modificationTime);
        pluginResult.message.modificationTime = modTime;
    }
    else if (pluginResult.message.lastModifiedDate) {
        var file = new File();
        file.size = pluginResult.message.size;
        file.type = pluginResult.message.type;
        file.name = pluginResult.message.name;
        file.fullPath = pluginResult.message.fullPath;
        file.lastModifiedDate = new Date(pluginResult.message.lastModifiedDate);
        pluginResult.message = file;
    }
    return pluginResult;
};

/**
 * Add the FileSystem interface into the browser.
 */
PhoneGap.addConstructor(function() {
	var pgLocalFileSystem = new LocalFileSystem();
	// Needed for cast methods
    if(typeof window.localFileSystem == "undefined") window.localFileSystem  = pgLocalFileSystem;
    if(typeof window.requestFileSystem == "undefined") window.requestFileSystem  = pgLocalFileSystem.requestFileSystem;
    if(typeof window.resolveLocalFileSystemURI == "undefined") window.resolveLocalFileSystemURI = pgLocalFileSystem.resolveLocalFileSystemURI;
});
}());
}
