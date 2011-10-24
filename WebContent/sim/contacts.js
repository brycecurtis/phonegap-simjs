addService("Contacts", function() {

	// Public
	// Handle requests 
	this.exec = function(action, args, callbackId) {
		console.log("Contacts."+action+"()");
		alert("Contacts API not implemented yet");
		return new PluginResult(callbackId, PluginResultStatus.OK, "NOT IMPLEMENTED", false);
		//return new PluginResult(callbackId, PluginResultStatus.INVALID_ACTION);
	};

	// Initialization 
	{
	}
});

/**
 * Retrieve all contacts
 */
function populateContacts() {
	console.log("contact.js: POPULATE CONTACTS");

    var searchDB = function(tx) {
        tx.executeSql('SELECT * FROM CONTACTS', [], function(tx, results) {
                    var len = results.rows.length, i;
                    var s = "";
                	if (len == 0) {
                    	s = "No contacts found";
	                }
    	            else {
	                    s = "Number of contacts: "+len+"<br><table cellspacing=0 cellpadding=0 style='border: 1px solid #000000;' width='100%'><tr><th style='border: 1px solid #000000; text-align:center'>ID</th><th style='border: 1px solid #000000; text-align:center'>Name</th><th style='border: 1px solid #000000; text-align:center'>Action</th></tr>";
    	                for (var i=0; i<len; i++) {
    	                	s = s + "<tr><td style='border: 1px solid #000000; text-align:center'>" + results.rows.item(i).id; + "</td>";
            	            s = s + "<td style='border: 1px solid #000000; text-align:center'>" + results.rows.item(i).displayName + "</td>";
            	            s = s + "<td style='border: 1px solid #000000; text-align:center'><button type='button' onClick='delContact(" + results.rows.item(i).id + ");'>Delete</button></td></tr>";
	                    }
    	                s = s + "</table>";
    	            }
                    
                   	// Add tree widget to DOM      
					var block = document.getElementById('contactsContainer');
					block.innerHTML = s;
                }, function() {
                    console.log("We got an error");
					var block = document.getElementById('contactsContainer');
					block.innerHTML = "We got an error";
                }
            );
	};
	
    var db = window.openDatabase("Contacts", "1.0", "PhoneGap SimJS", 500000);
    db.transaction(searchDB);
}

/**
 * Delete a contact
 */
function delContact(id) {
	console.log("contact.js: DELETE CONTACT WITH ID = " + id);
	
    var db = window.openDatabase("Contacts", "1.0", "PhoneGap SimJS", 500000);
    db.transaction(function(tx) {
		    tx.executeSql('DELETE FROM CONTACTS WHERE id="' + id +'"');
    	    tx.executeSql('DELETE FROM NAMES WHERE rawid="' + id +'"');
        	tx.executeSql('DELETE FROM FIELDS WHERE rawid="' + id +'"');
	        tx.executeSql('DELETE FROM ADDRESSES WHERE rawid="' + id +'"');
    	    tx.executeSql('DELETE FROM ORGANIZATIONS WHERE rawid="' + id +'"');
    	}, function() {
    		console.log("We got an error");
    	}, 
    	function() {
	    	console.log("Successfully delete contact with ID = " + id);
	    	populateContacts();
    	}
    );
}
