/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010, IBM Corporation
 */

if (!PhoneGap.hasResource("contact")) {
PhoneGap.addResource("contact");

/**
* Contains information about a single contact.
* @constructor
* @param {DOMString} id unique identifier
* @param {DOMString} displayName
* @param {ContactName} name
* @param {DOMString} nickname
* @param {Array.<ContactField>} phoneNumbers array of phone numbers
* @param {Array.<ContactField>} emails array of email addresses
* @param {Array.<ContactAddress>} addresses array of addresses
* @param {Array.<ContactField>} ims instant messaging user ids
* @param {Array.<ContactOrganization>} organizations
* @param {DOMString} revision date contact was last updated
* @param {DOMString} birthday contact's birthday
* @param {DOMString} gender contact's gender
* @param {DOMString} note user notes about contact
* @param {Array.<ContactField>} photos
* @param {Array.<ContactField>} categories
* @param {Array.<ContactField>} urls contact's web sites
* @param {DOMString} timezone the contacts time zone
*/
Contact = function (id, displayName, name, nickname, phoneNumbers, emails, addresses,
    ims, organizations, revision, birthday, gender, note, photos, categories, urls, timezone) {
    this.id = id || null;
    this.rawId = null;
    this.displayName = displayName || null;
    this.name = name || null; // ContactName
    this.nickname = nickname || null;
    this.phoneNumbers = phoneNumbers || null; // ContactField[]
    this.emails = emails || null; // ContactField[]
    this.addresses = addresses || null; // ContactAddress[]
    this.ims = ims || null; // ContactField[]
    this.organizations = organizations || null; // ContactOrganization[]
    this.revision = revision || null;
    this.birthday = birthday || null;
    this.gender = gender || null;
    this.note = note || null;
    this.photos = photos || null; // ContactField[]
    this.categories = categories || null; // ContactField[]
    this.urls = urls || null; // ContactField[]
    this.timezone = timezone || null;
};

/**
 *  ContactError.
 *  An error code assigned by an implementation when an error has occurreds
 * @constructor
 */
ContactError = function() {
    this.code=null;
};

/**
 * Error codes
 */
ContactError.UNKNOWN_ERROR = 0;
ContactError.INVALID_ARGUMENT_ERROR = 1;
ContactError.NOT_FOUND_ERROR = 2;
ContactError.TIMEOUT_ERROR = 3;
ContactError.PENDING_OPERATION_ERROR = 4;
ContactError.IO_ERROR = 5;
ContactError.NOT_SUPPORTED_ERROR = 6;
ContactError.PERMISSION_DENIED_ERROR = 20;

/**
* Removes contact from device storage.
* @param successCB success callback
* @param errorCB error callback
*/
Contact.prototype.remove = function(successCB, errorCB) {
    if (this.id === null) {
        var errorObj = new ContactError();
        errorObj.code = ContactError.NOT_FOUND_ERROR;
        errorCB(errorObj);
    }
    else {
        var me = this;
        var db = window.openDatabase("Contacts", "1.0", "PhoneGap SimJS", 500000);
        db.transaction(function(tx) {
            console.log("We are in remove contact");
            console.log("My id is " + this.id);
            tx.executeSql('DELETE FROM CONTACTS WHERE id="' + me.id +'"');
            tx.executeSql('DELETE FROM NAMES WHERE rawid="' + me.id +'"');
            tx.executeSql('DELETE FROM FIELDS WHERE rawid="' + me.id +'"');
            tx.executeSql('DELETE FROM ADDRESSES WHERE rawid="' + me.id +'"');
            tx.executeSql('DELETE FROM ORGANIZATIONS WHERE rawid="' + me.id +'"');
        }, errorCB, successCB);
    }
};

/**
* Creates a deep copy of this Contact.
* With the contact ID set to null.
* @return copy of this Contact
*/
Contact.prototype.clone = function() {
    var clonedContact = PhoneGap.clone(this);
    var i;
    clonedContact.id = null;
    clonedContact.rawId = null;
    // Loop through and clear out any id's in phones, emails, etc.
    if (clonedContact.phoneNumbers) {
        for (i = 0; i < clonedContact.phoneNumbers.length; i++) {
            clonedContact.phoneNumbers[i].id = null;
        }
    }
    if (clonedContact.emails) {
        for (i = 0; i < clonedContact.emails.length; i++) {
            clonedContact.emails[i].id = null;
        }
    }
    if (clonedContact.addresses) {
        for (i = 0; i < clonedContact.addresses.length; i++) {
            clonedContact.addresses[i].id = null;
        }
    }
    if (clonedContact.ims) {
        for (i = 0; i < clonedContact.ims.length; i++) {
            clonedContact.ims[i].id = null;
        }
    }
    if (clonedContact.organizations) {
        for (i = 0; i < clonedContact.organizations.length; i++) {
            clonedContact.organizations[i].id = null;
        }
    }
    if (clonedContact.tags) {
        for (i = 0; i < clonedContact.tags.length; i++) {
            clonedContact.tags[i].id = null;
        }
    }
    if (clonedContact.photos) {
        for (i = 0; i < clonedContact.photos.length; i++) {
            clonedContact.photos[i].id = null;
        }
    }
    if (clonedContact.urls) {
        for (i = 0; i < clonedContact.urls.length; i++) {
            clonedContact.urls[i].id = null;
        }
    }
    return clonedContact;
};

/**
* Persists contact to device storage.
* @param successCB success callback
* @param errorCB error callback
*/
Contact.prototype.save = function(successCB, errorCB) {
    var helper = new ContactSQLHelper();
    var saveContact = function(tx) {
        if (me.id == null) {
            tx.executeSql(helper.insertContact(me));
            var newId = null;
            tx.executeSql("SELECT id FROM CONTACTS", [], function(tx, results) {
                    var len = results.rows.length, i;
                    for (i = 0; i < len; i++) {
                        newId = results.rows.item(i).id;
                    }
                    // Name
                    if (me.name != null) {
                        tx.executeSql(helper.insertName(newId, me));
                    }
                    // Phone Numbers
                    if (me.phoneNumbers != null) {
                        for (var i=0; i < me.phoneNumbers.length; i++) {
                            tx.executeSql(helper.insertField(newId, me.phoneNumbers[i], "phone"));                    
                        }
                    }            
                    // Emails
                    if (me.emails != null) {
                        for (var i=0; i < me.emails.length; i++) {
                            tx.executeSql(helper.insertField(newId, me.emails[i], "email"));                    
                        }
                    }            
                    // IMs
                    if (me.ims != null) {
                        for (var i=0; i < me.ims.length; i++) {
                            tx.executeSql(helper.insertField(newId, me.ims[i], "im"));                    
                        }
                    }            
                    // Photos
                    if (me.photos != null) {
                        for (var i=0; i < me.photos.length; i++) {
                            tx.executeSql(helper.insertField(newId, me.photos[i], "photo"));                    
                        }
                    }            
                    // Categories
                    if (me.categories != null) {
                        for (var i=0; i < me.categories.length; i++) {
                            tx.executeSql(helper.insertField(newId, me.categories[i], "category"));                    
                        }
                    }            
                    // URLs
                    if (me.urls != null) {
                        for (var i=0; i < me.urls.length; i++) {
                            tx.executeSql(helper.insertField(newId, me.urls[i], "url"));                    
                        }
                    }            
                    // Addresses
                    if (me.addresses != null) {
                        for (var i=0; i < me.addresses.length; i++) {
                            tx.executeSql(helper.insertAddress(newId, me.addresses[i]));                    
                        }
                    }            
                    // Organizations
                    if (me.organizations != null) {
                        for (var i=0; i < me.organizations.length; i++) {
                            tx.executeSql(helper.insertOrganization(newId, me.organizations[i]));                    
                        }
                    }            
                }, function() {
                    console.log("We got an error");
                }
            );
        } else {
            tx.executeSql(helper.updateContact(me));
            // Name
            if (me.name != null) {
                if (me.name.id == null) {
                    tx.executeSql(helper.insertName(newId, me));
                } else {
                    tx.executeSql(helper.updateName(me));
                }
            }
            // Phone Numbers
            if (me.phoneNumbers != null) {
                for (var i=0; i < me.phoneNumbers.length; i++) {
                    if (me.phoneNumbers[i].id == null) {
                        tx.executeSql(helper.insertField(newId, me.phoneNumbers[i], "phone"));
                    } else {
                        tx.executeSql(helper.updateField(me.phoneNumbers[i], "phone"));
                    }                    
                }
            }  
            // Emails
            if (me.emails != null) {
                for (var i=0; i < me.emails.length; i++) {
                    if (me.emails[i].id == null) {
                        tx.executeSql(helper.insertField(newId, me.emails[i], "email"));                    
                    } else {
                        tx.executeSql(helper.updateField(me.emails[i], "email"));
                    }                    
                }
            }            
            // IMs
            if (me.ims != null) {
                for (var i=0; i < me.ims.length; i++) {
                    if (me.ims[i].id == null) {
                        tx.executeSql(helper.insertField(newId, me.ims[i], "im"));                    
                    } else {
                        tx.executeSql(helper.updateField(me.ims[i], "im"));
                    }                    
                }
            }            
            // Photos
            if (me.photos != null) {
                for (var i=0; i < me.photos.length; i++) {
                    if (me.photos[i].id == null) {
                        tx.executeSql(helper.insertField(newId, me.photos[i], "photo"));                    
                    } else {
                        tx.executeSql(helper.updateField(me.photos[i], "photo"));
                    }                    
                }
            }            
            // Categories
            if (me.categories != null) {
                for (var i=0; i < me.categories.length; i++) {
                    if (me.categories[i].id == null) {
                        tx.executeSql(helper.insertField(newId, me.categories[i], "category"));                    
                    } else {
                        tx.executeSql(helper.updateField(me.categories[i], "category"));
                    }                    
                }
            }            
            // URLs
            if (me.urls != null) {
                for (var i=0; i < me.urls.length; i++) {
                    if (me.urls[i].id == null) {
                        tx.executeSql(helper.insertField(newId, me.urls[i], "url"));                    
                    } else {
                        tx.executeSql(helper.updateField(me.urls[i], "url"));
                    }                    
                }
            }            
            // Addresses
            if (me.addresses != null) {
                for (var i=0; i < me.addresses.length; i++) {
                    if (me.addresses[i].id == null) {
                        tx.executeSql(helper.insertAddress(newId, me.addresses[i]));                    
                    } else {
                        tx.executeSql(helper.updateAddress(me.addresses[i]));
                    }                    
                }
            }            
            // Organizations
            if (me.organizations != null) {
                for (var i=0; i < me.organizations.length; i++) {
                    if (me.organizations[i].id == null) {
                        tx.executeSql(helper.insertOrganization(newId, me.organizations[i]));                    
                    } else {
                        tx.executeSql(helper.updateOrganization(me.organizations[i]));
                    }                    
                }
            }  
        }
                
    };
    var me = this;
    var db = window.openDatabase("Contacts", "1.0", "PhoneGap SimJS", 500000);
    db.transaction(saveContact, errorCB, successCB);
};

/**
* Contact name.
* @constructor
* @param formatted
* @param familyName
* @param givenName
* @param middle
* @param prefix
* @param suffix
*/
ContactName = function(formatted, familyName, givenName, middle, prefix, suffix) {
    this.formatted = formatted || null;
    this.familyName = familyName || null;
    this.givenName = givenName || null;
    this.middleName = middle || null;
    this.honorificPrefix = prefix || null;
    this.honorificSuffix = suffix || null;
};

/**
* Generic contact field.
* @constructor
* @param {DOMString} id unique identifier, should only be set by native code
* @param type
* @param value
* @param pref
*/
ContactField = function(type, value, pref) {
	this.id = null;
    this.type = type || null;
    this.value = value || null;
    this.pref = pref || null;
};

/**
* Contact address.
* @constructor
* @param {DOMString} id unique identifier, should only be set by native code
* @param formatted
* @param streetAddress
* @param locality
* @param region
* @param postalCode
* @param country
*/
ContactAddress = function(formatted, streetAddress, locality, region, postalCode, country) {
	this.id = null;
    this.formatted = formatted || null;
    this.streetAddress = streetAddress || null;
    this.locality = locality || null;
    this.region = region || null;
    this.postalCode = postalCode || null;
    this.country = country || null;
};

/**
* Contact organization.
* @constructor
* @param {DOMString} id unique identifier, should only be set by native code
* @param name
* @param dept
* @param title
* @param startDate
* @param endDate
* @param location
* @param desc
*/
ContactOrganization = function(name, dept, title) {
	this.id = null;
    this.name = name || null;
    this.department = dept || null;
    this.title = title || null;
};

/**
* Represents a group of Contacts.
* @constructor
*/
var Contacts = function() {
    var createDB = function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS CONTACTS (id INTEGER PRIMARY KEY, displayName, nickname, revision, birthday, gender, note, timezone)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS NAMES (id INTEGER PRIMARY KEY, rawId, formatted, familyName, givenName, middleName, honorificPrefix, honorificSuffix)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS FIELDS (id INTEGER PRIMARY KEY, rawId, type, value, pref, mimetype)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ADDRESSES (id INTEGER PRIMARY KEY, rawId, formatted, streetAddress, locality, region, postalCode, country)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ORGANIZATIONS (id INTEGER PRIMARY KEY, rawId, name, department, title)');
    }

    var db = window.openDatabase("Contacts", "1.0", "PhoneGap SimJS", 500000);
    db.transaction(createDB);
    
    this.inProgress = false;
    this.records = [];
};
/**
* Returns an array of Contacts matching the search criteria.
* @param fields that should be searched
* @param successCB success callback
* @param errorCB error callback
* @param {ContactFindOptions} options that can be applied to contact searching
* @return array of Contacts matching search criteria
*/
Contacts.prototype.find = function(fields, successCB, errorCB, options) {
    var searchDB = function(tx) {
        tx.executeSql('SELECT * FROM CONTACTS', [], function(tx, results) {
                    var len = results.rows.length, i;
                    var contactlist = [];
                    var cnt = 0;
                    // Call success callback when all contacts have been added
                    var success = function() {
                        console.log("Success has been called");
                        cnt++;
                        console.log("Count is = " + cnt);
                        if (cnt == results.rows.length) {
                            if (successCB) successCB(contactlist);
                        }
                    };


                    for (i = 0; i < len; i++) {
                        var createContactData = function(position) {
                        
                            var internalCnt = 0;
                            // Call success callback when all queries are done
                            var internalSuccess = function(){
                                internalCnt++;
                                console.log("Internal count = " + internalCnt);
                                if (internalCnt == 4) {
                                    console.log("I'm pushing the contact now");
                                    console.log("Pushing " + contactlist[position].displayName);
                                    //contactlist.push(contactlist[position]);
                                    console.log("Calling success");
                                    internalCnt = 0;
                                    success();
                                }
                            };
                            
                            
                            contactlist[position] = new Contact();
                            contactlist[position].id = results.rows.item(i).id;
                            contactlist[position].displayName = results.rows.item(i).displayName;
                            contactlist[position].nickname = results.rows.item(i).nickname;
                            contactlist[position].revision = results.rows.item(i).revision;
                            contactlist[position].birthday = results.rows.item(i).birthday;
                            contactlist[position].gender = results.rows.item(i).gender;
                            contactlist[position].note = results.rows.item(i).note;
                            contactlist[position].timezone = results.rows.item(i).timezone;
                            
                            var addName = function(tx, results){
                                console.log("I'm in addName what is i? " + i);
                                if (results.rows.length == 1) {
                                    console.log("I got the name");
                                    var contactName = {};
                                    contactName.id = results.rows.item(0).id;
                                    contactName.rawId = contactlist[position].id;
                                    contactName.formatted = results.rows.item(0).formatted;
                                    contactName.familyName = results.rows.item(0).familyName;
                                    contactName.givenName = results.rows.item(0).givenName;
                                    contactName.middleName = results.rows.item(0).middleName;
                                    contactName.honorificPrefix = results.rows.item(0).honorificPrefix;
                                    contactName.honorificSuffix = results.rows.item(0).honorificSuffix;
                                    contactlist[position].name = contactName;
                                }
                                console.log("Name query done");
                                internalSuccess();
                            };
                            
                            // NAMES
                            tx.executeSql('SELECT * FROM NAMES WHERE rawId="' + contactlist[position].id + '"', [], addName, function(){
                                console.log("We got an error searching names");
                            });
                            
                            var addFields = function(tx, results){
                                var phones = [];
                                var emails = [];
                                var ims = [];
                                var photos = [];
                                var categories = [];
                                var urls = [];
                                var len = results.rows.length, i;
                                for (i = 0; i < len; i++) {
                                    console.log("I got an field");
                                    var contactField = {};
                                    contactField.id = results.rows.item(i).id;
                                    contactField.rawId = contactlist[position].id;
                                    contactField.type = results.rows.item(i).type;
                                    contactField.value = results.rows.item(i).value;
                                    contactField.pref = results.rows.item(i).pref;
                                    var fieldType = results.rows.item(i).mimetype;
                                    if (fieldType == "phone") {
                                        phones.push(contactField);
                                    }
                                    else 
                                        if (fieldType == "email") {
                                            emails.push(contactField);
                                        }
                                        else 
                                            if (fieldType == "photo") {
                                                photos.push(contactField);
                                            }
                                            else 
                                                if (fieldType == "im") {
                                                    ims.push(contactField);
                                                }
                                                else 
                                                    if (fieldType == "category") {
                                                        categories.push(contactField);
                                                    }
                                                    else 
                                                        if (fieldType == "url") {
                                                            urls.push(contactField);
                                                        }
                                }
                                contactlist[position].phoneNumbers = phones;
                                contactlist[position].emails = emails;
                                contactlist[position].ims = ims;
                                contactlist[position].photos = photos;
                                contactlist[position].categories = categories;
                                contactlist[position].urls = urls;
                                console.log("Field query done");
                                internalSuccess();
                            };
                            
                            // FIELDS
                            tx.executeSql('SELECT * FROM FIELDS WHERE rawId="' + contactlist[position].id + '"', [], addFields, function(){
                                console.log("We got an error searching names");
                            });
                            
                            var addAddresses = function(tx, results){
                                var addresses = [];
                                var len = results.rows.length, i;
                                for (i = 0; i < len; i++) {
                                    console.log("I got an address");
                                    var contactAddress = {};
                                    contactAddress.id = results.rows.item(i).id;
                                    contactAddress.rawId = contactlist[position].id;
                                    contactAddress.formatted = results.rows.item(i).formatted;
                                    contactAddress.streetAddress = results.rows.item(i).streetAddress;
                                    contactAddress.locality = results.rows.item(i).locality;
                                    contactAddress.region = results.rows.item(i).region;
                                    contactAddress.postalCode = results.rows.item(i).postalCode;
                                    contactAddress.country = results.rows.item(i).country;
                                    addresses.push(contactAddress);
                                }
                                contactlist[position].addresses = addresses;
                                console.log("Field query done");
                                internalSuccess();
                            };
                            
                            // ADDRESSES
                            tx.executeSql('SELECT * FROM ADDRESSES WHERE rawId="' + contactlist[position].id + '"', [], addAddresses, function(){
                                console.log("We got an error searching names");
                            });
                            
                            var addOrgs = function(tx, results){
                                var orgs = [];
                                var len = results.rows.length, i;
                                for (i = 0; i < len; i++) {
                                    console.log("I got an org");
                                    var contactOrg = {};
                                    contactOrg.id = results.rows.item(i).id;
                                    contactOrg.rawId = contactlist[position].id;
                                    contactOrg.name = results.rows.item(i).name;
                                    contactOrg.department = results.rows.item(i).department;
                                    contactOrg.title = results.rows.item(i).title;
                                    orgs.push(contactOrg);
                                }
                                contactlist[position].organizations = orgs;
                                console.log("Org query done");
                                internalSuccess();
                            };
                            
                            // ORGANIZATIONS
                            tx.executeSql('SELECT * FROM ORGANIZATIONS WHERE rawId="' + contactlist[position].id + '"', [], addOrgs, function(){
                                console.log("We got an error searching names");
                            });
                        }
                        createContactData(i);
                    }
                }, function() {
                    console.log("We got an error");
                }
            );

    }

    var db = window.openDatabase("Contacts", "1.0", "PhoneGap SimJS", 500000);
    db.transaction(searchDB, errorCB);
};

/**
* This function creates a new contact, but it does not persist the contact
* to device storage. To persist the contact to device storage, invoke
* contact.save().
* @param properties an object who's properties will be examined to create a new Contact
* @returns new Contact object
*/
Contacts.prototype.create = function(properties) {
    var i;
	var contact = new Contact();
    for (i in properties) {
        if (contact[i] !== 'undefined') {
            contact[i] = properties[i];
        }
    }
    return contact;
};

/**
* This function returns and array of contacts.  It is required as we need to convert raw
* JSON objects into concrete Contact objects.  Currently this method is called after
* navigator.service.contacts.find but before the find methods success call back.
*
* @param jsonArray an array of JSON Objects that need to be converted to Contact objects.
* @returns an array of Contact objects
*/
Contacts.prototype.cast = function(pluginResult) {
	var contacts = [];
	var i;
	for (i=0; i<pluginResult.message.length; i++) {
		contacts.push(navigator.service.contacts.create(pluginResult.message[i]));
	}
	pluginResult.message = contacts;
	return pluginResult;
};

/**
 * ContactFindOptions.
 * @constructor
 * @param filter used to match contacts against
 * @param multiple boolean used to determine if more than one contact should be returned
 * @param updatedSince return only contact records that have been updated on or after the given time
 */
ContactFindOptions = function(filter, multiple, updatedSince) {
    this.filter = filter || '';
    this.multiple = multiple || true;
    this.updatedSince = updatedSince || '';
};

var ContactSQLHelper = function() {
};

ContactSQLHelper.prototype.insertContact = function(contact) {
  return ('INSERT INTO CONTACTS (displayName, nickname, revision, birthday, gender, note, timezone) VALUES ("' +
            contact.displayName +
            '", "' +
            contact.nickname +
            '", "' +
            contact.revision +
            '", "' +
            contact.birthday +
            '", "' +
            contact.gender +
            '", "' +
            contact.note +
            '", "' +
            contact.timezone +
            '")');  
};

ContactSQLHelper.prototype.insertName = function(newId, contact, mimetype) {
  return ('INSERT INTO NAMES (rawId, formatted, familyName, givenName, middleName, honorificPrefix, honorificSuffix) VALUES ("' +
            newId +
            '", "' +
            contact.name.formatted +
            '", "' +
            contact.name.familyName +
            '", "' +
            contact.name.givenName +
            '", "' +
            contact.name.middleName +
            '", "' +
            contact.name.honorificPrefix +
            '", "' +
            contact.name.honorificSuffix +
            '")');  
};

ContactSQLHelper.prototype.insertField = function(newId, field, mimetype) {
  return ('INSERT INTO FIELDS (rawId, type, value, pref, mimetype) VALUES ("' +
            newId +
            '", "' +
            field.type +
            '", "' +
            field.value +
            '", "' +
            field.pref +
            '", "' +
            mimetype +
            '")');  
};

ContactSQLHelper.prototype.insertAddress = function(newId, address) {
  return ('INSERT INTO ADDRESSES (rawId, formatted, streetAddress, locality, region, postalCode, country) VALUES ("' +
            newId +
            '", "' +
            address.formatted +
            '", "' +
            address.streetAddress +
            '", "' +
            address.locality +
            '", "' +
            address.region +
            '", "' +
            address.postalCode +
            '", "' +
            address.country +
            '")');  
};

ContactSQLHelper.prototype.insertOrganization = function(newId, org) {
  return ('INSERT INTO ORGANIZATIONS (rawId, name, department, title) VALUES ("' +
            newId +
            '", "' +
            org.name +
            '", "' +
            org.department +
            '", "' +
            org.title +
            '")');  
};

ContactSQLHelper.prototype.updateContact = function(contact) {
  return ('UPDATE CONTACTS SET displayName = "' + contact.displayName + '", nickname = "' + contact.nickname + '",' +
            ' revision = "' + contact.revision + '", birthday = "' + contact.birthday + '", gender = "' + contact.gender + '",' +
            ' note = "' + contact.note + '", timezone = "' + contact.timezone + '"' +
            ' where id = ' + contact.id);  
};

ContactSQLHelper.prototype.updateName = function(contact, mimetype) {
  return ('UPDATE NAMES SET formatted = "' + contact.name.formatted + '", familyName = "' + contact.name.familyName + '",' +
            ' givenName = "' + contact.name.givenName + '", middleName = "' + contact.name.middleName + '", honorificPrefix = "' + contact.name.honorificPrefix + '",' +
            ' honorificSuffix = "' + contact.name.honorificSuffix + '" ' +
            ' where id = ' + contact.name.id);  
};

ContactSQLHelper.prototype.updateField = function(field, mimetype) {
  return ('UPDATE FIELDS SET type = "' + field.type + '", value = "' + field.value + '",' +
            ' pref = "' + field.pref + '", mimetype = "' + mimetype + '" ' +
            ' where id = ' + field.id);  
};

ContactSQLHelper.prototype.updateAddress = function(address) {
  return ('UPDATE ADDRESSES SET formatted = "' + address.formatted + '", streetAddress = "' + address.streetAddress + '",' +
            ' locality = "' + address.locality + '", region = "' + address.region + '", postalCode = "' + address.postalCode + '",' +
            ' country = "' + address.country + '" ' +
            ' where id = ' + address.id);  
};

ContactSQLHelper.prototype.updateOrganization = function(org) {
  return ('UPDATE ORGANIZATIONS SET name = "' + org.name + '", department = "' + org.department + '",' +
            ' title = "' + org.title + '" ' +
            ' where id = ' + org.id);  
};

/**
 * Add the contact interface into the browser.
 */
PhoneGap.addConstructor(function() {
    if(typeof navigator.service === "undefined") {
        navigator.service = {};
    }
    if(typeof navigator.service.contacts === "undefined") {
        navigator.service.contacts = new Contacts();
    }
});
};
