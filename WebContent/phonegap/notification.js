/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010, IBM Corporation
 */

if (!PhoneGap.hasResource("notification")) {
PhoneGap.addResource("notification");

/**
 * This class provides access to notifications on the device.
 */
var Notification = function() {
};

/**
 * Open a native alert dialog, with a customizable title and button text.
 *
 * @param {String} message              Message to print in the body of the alert
 * @param {Function} completeCallback   The callback that is called when user clicks on a button.
 * @param {String} title                Title of the alert dialog (default: Alert)
 * @param {String} buttonLabel          Label of the close button (default: OK)
 */
Notification.prototype.alert = function(message, completeCallback, title, buttonLabel) {
	var _title = (title || "Alert");
	var _buttonLabel = (buttonLabel || "OK");
	alert("Message="+message+"\nButton="+_buttonLabel);
	if (completeCallback) {
		completeCallback();
	}
};

/**
 * Open a native confirm dialog, with a customizable title and button text.
 * The result that the user selects is returned to the result callback.
 *
 * @param {String} message              Message to print in the body of the alert
 * @param {Function} resultCallback     The callback that is called when user clicks on a button.
 * @param {String} title                Title of the alert dialog (default: Confirm)
 * @param {String} buttonLabels         Comma separated list of the labels of the buttons (default: 'OK,Cancel')
 */
Notification.prototype.confirm = function(message, resultCallback, title, buttonLabels) {
	var _title = (title || "Confirm");
	var _buttonLabels = (buttonLabels || "OK,Cancel");
	var r = confirm("Message="+message+"\nButtons="+buttonLabels);
	if (resultCallback) {
		resultCallback(r);
	}
};

/**
 * Start spinning the activity indicator on the statusbar
 */
Notification.prototype.activityStart = function() {
	console.log("Notification.activityStart()");
	showPopUp("Activity", "Activity started.");

};

/**
 * Stop spinning the activity indicator on the statusbar, if it's currently spinning
 */
Notification.prototype.activityStop = function() {
	console.log("Notification.activityStop()");
	hidePopUp();
};

/**
 * Display a progress dialog with progress bar that goes from 0 to 100.
 *
 * @param {String} title        Title of the progress dialog.
 * @param {String} message      Message to display in the dialog.
 */
Notification.prototype.progressStart = function(title, message) {
	console.log("Notification.progressStart(): Title="+title+" message="+message);
	showPopUp("Progress", "Progress started.<br>Title: "+title+"<br>Message: "+message);
};

/**
 * Set the progress dialog value.
 *
 * @param {Number} value         0-100
 */
Notification.prototype.progressValue = function(value) {
	console.log("Notification.progressValue("+value+")");
	showPopUp("Progress", "Progress value = "+value);
};

/**
 * Close the progress dialog.
 */
Notification.prototype.progressStop = function() {
	console.log("Notification.progressStop()");
	hidePopUp();
};

/**
 * Causes the device to blink a status LED.
 *
 * @param {Integer} count       The number of blinks.
 * @param {String} colour       The colour of the light.
 */
Notification.prototype.blink = function(count, colour) {
	showPopUp("Blink", "Blink "+count+" times with color "+colour+".");
};

/**
 * Causes the device to vibrate.
 *
 * @param {Integer} mills       The number of milliseconds to vibrate for.
 */
Notification.prototype.vibrate = function(mills) {
	showPopUp("Vibrate", "Vibrate for "+mills+" ms.");
};

/**
 * Causes the device to beep.
 * On Android, the default notification ringtone is played "count" times.
 *
 * @param {Integer} count       The number of beeps.
 */
Notification.prototype.beep = function(count) {
	showPopUp("Beep", "Beep "+count+" times.");
};

PhoneGap.addConstructor(function() {
    if (typeof navigator.notification === "undefined") {
        navigator.notification = new Notification();
    }
});

};
