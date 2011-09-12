
// Determine what base url where sim.html is located, so that we can ?
/*
var baseUrl = "";
{
	var src = ""+document.location;
    var p = src.indexOf("/sim.html");
    if (p > 0) {
    	baseUrl = src.substring(0, p);
    }
}
console.log("baseUrl="+baseUrl);
*/

// Initial mobile HTML page to load
var htmlPage = "index.html";

//Flag that indicates plugins have been loaded and initialized
var initPluginsCompleted = false;

// PluginResult status enum
PluginResultStatus = {
	    NO_RESULT: 0,
	    OK: 1,
	    CLASS_NOT_FOUND_EXCEPTION: 2,
	    ILLEGAL_ACCESS_EXCEPTION: 3,
	    INSTANTIATION_EXCEPTION: 4,
	    MALFORMED_URL_EXCEPTION: 5,
	    IO_EXCEPTION: 6,
	    INVALID_ACTION: 7,
	    JSON_EXCEPTION: 8,
	    ERROR: 9,
	    EVENT: 10
	    };

//List of plugins
var plugins = {};

// Iframe object in which the mobile HTML is loaded
var iframeWindow;

/**
 * Method to fire document event.  
 * This is called by Java applets to send events and data to JS.
 *
 * @param {String} type             The event type to fire
 * @param {Object} data             Data to send with event
 */
fireDocumentEvent = function(type, data) {
    console.log("PhoneGap.fireDocumentEvent("+type+")");
    var e = document.createEvent('Events');
    e.initEvent(type, false, false);
    if (data) {
        for (var i in data) {
            e[i] = data[i];
        }
    }
    document.dispatchEvent(e);
};

/**
 * Called when Dojo has loaded.
 */
dojo.addOnLoad(function() {
    console.log("dojo.addOnLoad()");
    document.getElementById("simulator").src = htmlPage;
    initUrl(htmlPage);
    initPlugins();
});

/**
 * Called when mobile HTML page has been loaded
 */
var frameOnLoad = function() {
    if (document.getElementById("simulator").src) {
        console.log("frameOnLoad()="+document.getElementById("simulator").src);
        iframeWindow = document.getElementById("simulator").contentWindow;
        initPlugins();
    }
};

/**
 * Initialize plugins
 */
var initPlugins = function() {
    for (var svc in plugins) {
        if (plugins[svc].obj === null) {
           plugins[svc].obj = new plugins[svc].callback();
        }
    }
    initPluginsCompleted = true;
};

/**
 * Receives request destined for plugins from mobile device via postMessage request.
 * Returns PluginResult object back to mobile device by using postMessage.
 *
 * @param {Object} e        e.data is JSON serialized string of request
 */
window.addEventListener("message", function(e){
    console.log("*****BC***** "+e.domain + " said: " + e.data+" origin:"+e.origin);
    eval("var t="+e.data);
    console.log(" -- DUMP="+dumpObj(t, '', ' ', 2));
    var r = null;
    console.log("type="+(typeof plugins[t.service]));
    if (typeof plugins[t.service] === 'object') {
        r = plugins[t.service].obj.exec(t.action, t.args, t.callbackId);
    }
    else {
    	r = new PluginResult(t.callbackId, PluginResultStatus.CLASS_NOT_FOUND_EXCEPTION);
    }
    console.log("Type of r="+(typeof r)+"  Sending "+dumpObj(r,'',' ',3));
    if (typeof r === 'object') {
        e.source.postMessage(JSON.stringify(r), "*");
    }
    else {
    	e.source.postMessage(r, "*");
    }
}, false);

 /**
  * Send event to mobile device using postMessage
  *
  * @param type
  */
var fireEvent = function(type) {
     console.log("fireEvent("+type+")");
     if (iframeWindow) {
    	 iframeWindow.postMessage(JSON.stringify({id:"", status:PluginResultStatus.EVENT, message:type}), "*");
     }
};

/**
 * Send result to mobile device using postMessage
 *
 * @param {PluginResult} r
 */
var sendResult = function(r) {
    console.log("Sending result "+dumpObj(r,'',' ',2));
    if (iframeWindow) {
    	iframeWindow.postMessage(JSON.stringify(r), "*");
    }
};

/**
 * Create a new plugin result
 * 
 * @param id {String}				The callback id
 * @param status {enum}				PluginResultStatus
 * @param message {String}			Stringified JSON object
 * @param keepCallback {Boolean}	T=keep callback, F=remove callback (default=F)
 * @param cast {String}				Cast (default=null)
 */
var PluginResult = function(id, status, message, keepCallback, cast) {
    this.id = id;
	this.status = status;
	this.message = message;
	if (cast) {
		this.cast = cast;
	}
	this.keepCallback = keepCallback | false;
};

/**
 * Register a plugin for a service.
 *
 * @param service
 * @param callback
 */
var addService = function(service, callback) {
	plugins[service] = {callback:callback, obj:null};
	if (initPluginsCompleted) {
        plugins[service].obj = new callback();
	}
};

/**
 * Return plugin object for service
 *
 * @return {Object}
 */
var getService = function(service) {
	return plugins[service].obj;
};

//-----------------------------------------------------------------------------
// HELPER METHODS
//-----------------------------------------------------------------------------

/**
 * Dump object to string.
 */
var dumpObj = function(obj, name, indent, depth) {
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
        return obj;
    }
};

/**
 * Load a JavaScript file.
 *
 * @param {String} jsfile               The url of the JavaScript file to load.
 * @param {Function} successCallback    The callback to call when the file has been loaded.
 */
var loadJavascript = function(jsfile, successCallback) {
    console.log("loadJavascript("+jsfile+")");
    var id = document.getElementsByTagName("head")[0];         
    var el = document.createElement('script');
    el.type = 'text/javascript';
    if (typeof successCallback === 'function') {
        el.onload = successCallback;
    }
    el.src = jsfile;
    id.appendChild(el);
};

/**
 * Determine base URL for a JS file.
 * 
 * @param {String} name				The name of the JS file
 * @return {String}
 */
var getScriptBase = function(name) {
	var dir = '';
	var lists = document.getElementsByTagName("script");
	for (var i = 0; i < lists.length; i++) {
		console.log("script tag="+lists[i].src);
		var src = ""+lists[i].src;
		var p = src.indexOf(name);
		if (p > 0) {
			dir = src.substring(0, p);
			break;
		}
	}
	console.log(">>>>>> "+name+" is loaded from "+dir);
	return dir;
};

/**
 * Get random number
 */
var rand = function(max) {
    return Math.random()*max;
};

//function roundNumber(num) {
//    var dec = 3;
//    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
//    return result;
//}
