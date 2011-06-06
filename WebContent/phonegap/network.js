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
var Network = function() {
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

PhoneGap.addConstructor(function() {
    if (typeof navigator.network === "undefined") {
        navigator.network = new Network();
    }
});

/**
 * Simulate network connection
 */
Network.prototype.getNext = function() {
	return NetworkStatus.REACHABLE_VIA_WIFI_NETWORK = 2;
};

};
