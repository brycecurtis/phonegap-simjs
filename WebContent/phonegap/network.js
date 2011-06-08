/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010, IBM Corporation
 */

if (!PhoneGap.hasResource("network")) {
PhoneGap.addResource("network");

/**
 * This class contains information about any NetworkStatus.
 * @constructor
 */
NetworkStatus = function() {
};

NetworkStatus.NOT_REACHABLE = 0;
NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK = 1;
NetworkStatus.REACHABLE_VIA_WIFI_NETWORK = 2;

/**
 * This class provides access to device Network data (reachability).
 * @constructor
 */
Network = function() {
};


/**
 * Determine if a URI is reachable over the network.

 * @param {Object} uri
 * @param {Function} callback
 * @param {Object} options  (isIpAddress:boolean)
 */
Network.prototype.isReachable = function(uri, callback, options) {
    var isIpAddress = false;
    if (options && options.isIpAddress) {
        isIpAddress = options.isIpAddress;
    }
    setTimeout(function() {
    	callback(navigator.network.getNext());
    }, 1);
};

/**
 * This class contains information about the current network Connection.
 * @constructor
 */
Connection = function() {
	console.log("network.js: Connection()");
    this.type = null;
    this.networkName = null;
    this._firstRun = true;
    this._timer = null;
    this.timeout = 500;

    var me = this;
    this.getInfo(
        function(info) {
            // Need to send events if we are on or offline
            if (info.type == "none") {
                // set a timer if still offline at the end of timer send the offline event
                me._timer = setTimeout(function(){
                    me.type = info.type;
                    me.networkName = info.networkName;
                    PhoneGap.fireEvent('offline');
                    me._timer = null;
                    }, me.timeout);
            } else {
                // If there is a current offline event pending clear it
                if (me._timer != null) {
                    clearTimeout(me._timer);
                    me._timer = null;
                }
                me.type = info.type;
                me.networkName = info.networkName;
                PhoneGap.fireEvent('online');
            }
            
            // should only fire this once
            if (me._firstRun) {
                me._firstRun = false;
                PhoneGap.onPhoneGapConnectionReady.fire();
            }            
        },
        function(e) {
            console.log("Error initializing Network Connection: " + e);
        });
};

Connection.UNKNOWN = "unknown";
Connection.ETHERNET = "ethernet";
Connection.WIFI = "wifi";
Connection.CELL_2G = "2g";
Connection.CELL_3G = "3g";
Connection.CELL_4G = "4g";
Connection.NONE = "none";

/**
 * Get connection info
 *
 * @param {Function} successCallback The function to call when the Connection data is available
 * @param {Function} errorCallback The function to call when there is an error getting the Connection data. (OPTIONAL)
 */
Connection.prototype.getInfo = function(successCallback, errorCallback) {
    // Get info
    PhoneGap.exec(successCallback, errorCallback, "Network Status", "getConnectionInfo", []);
};

PhoneGap.addConstructor(function() {
	console.log("Adding network="+navigator.network);
    if (typeof navigator.network === "undefined") {
        navigator.network = new Network();
    }
    if (typeof navigator.network.connection === "undefined") {
        navigator.network.connection = new Connection();
        console.log(" -- connection now ="+navigator.network.connection);
    }
});

/**
 * Simulate network connection
 */
Network.prototype.getNext = function() {
	return parent.getNetwork();
};

};
