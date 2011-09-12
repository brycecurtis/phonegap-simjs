/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.    
 */

package org.apache.wink.json4j.compat.impl;

import java.io.Writer;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

import org.apache.wink.json4j.compat.JSONArray;
import org.apache.wink.json4j.compat.JSONException;
import org.apache.wink.json4j.compat.JSONObject;

/**
 *	 
 */          
public class ApacheJSONObjectDelegate implements JSONObject {

    protected org.apache.wink.json4j.JSONObject delegate = null;

    public ApacheJSONObjectDelegate() {
        delegate = new org.apache.wink.json4j.JSONObject();
    }

    public ApacheJSONObjectDelegate(org.apache.wink.json4j.JSONObject jObj) {
        delegate = jObj;
    }


    // ------- data accessor methods -------
    public Object get(String key) {
        try {
            Object obj = this.delegate.get(key);
            if (obj == null) {
                return null;
            } else {
                Class clazz = obj.getClass();
                if (org.apache.wink.json4j.JSONObject.class.isAssignableFrom(clazz)) {
                    return new ApacheJSONObjectDelegate((org.apache.wink.json4j.JSONObject)obj);
                } else if (org.apache.wink.json4j.JSONArray.class.isAssignableFrom(clazz)) {
                    return new ApacheJSONArrayDelegate((org.apache.wink.json4j.JSONArray)obj);
                }else if (Number.class.isAssignableFrom(clazz)) {
                    return obj;
                } else if (Boolean.class.isAssignableFrom(clazz)) {
                    return obj;
                } else if (String.class.isAssignableFrom(clazz)) {
                    return obj;
                }
            }
        } catch (Exception ex) {
            // DO something
        }
        return null;
    }


    public boolean getBoolean(String key) throws JSONException {
        try {
            return delegate.getBoolean(key); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public double getDouble(String key) throws JSONException {
        try {
            return delegate.getDouble(key); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public int getInt(String key) throws JSONException {
        try {
            return delegate.getInt(key); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public long getLong(String key) throws JSONException {
        try {
            return delegate.getLong(key); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public short getShort(String key) throws JSONException {
        try {
            return delegate.getShort(key); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public String getString(String key) throws JSONException {
        try {
            return delegate.getString(key); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONObject getJSONObject(String key) throws JSONException {
        try {
            org.apache.wink.json4j.JSONObject obj = delegate.getJSONObject(key); 
            if (obj == null) {
                return null;
            }
            return new ApacheJSONObjectDelegate(obj);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray getJSONArray(String key) {
        return null;
    }

    public JSONObject append(String key, Object value) throws JSONException {
        try {
            Object oldVal = this.delegate.get(key);
            JSONArray array = null;
            if (oldVal == null) {
                array = new org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate(new org.apache.wink.json4j.JSONArray());
                if (this.has(key)) {
                    // Add a null if the key was actually there, but just
                    // had value of null.
                    array.put((Object)null);
                }
            } else if (org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate.class.isAssignableFrom(oldVal.getClass())) {
                array = (JSONArray)oldVal;
            } else if (org.apache.wink.json4j.JSONArray.class.isAssignableFrom(oldVal.getClass())) {
                array = new org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate((org.apache.wink.json4j.JSONArray)oldVal);
            } else {
                array = new org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate(new org.apache.wink.json4j.JSONArray());
                array.put(oldVal);
            }
            array.put(value);
            return put(key,array);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONObject put(String key, boolean value) {
        try { 
            delegate.put(key, value);
        } catch (Exception ex) {
            // Squelch, should never throw anyway.  
        }
        return this;
    }

    public JSONObject put(String key, Collection value) throws JSONException{
        try {
            delegate.put(key, value);
        } catch (Exception ex){
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
        return this;
    }

    public JSONObject put(String key, double value) {
        try { 
            delegate.put(key, value);
        } catch (Exception ex) {
            // Squelch, should never throw anyway.  
        }
        return this;
    }

    public JSONObject put(String key, int value) {
        try { 
            delegate.put(key, value);
        } catch (Exception ex) {
            // Squelch, should never throw anyway.  
        }
        return this;
    }

    public JSONObject put(String key, long value) {
        try { 
            delegate.put(key, value);
        } catch (Exception ex) {
            // Squelch, should never throw anyway.  
        }
        return this;
    }

    public JSONObject put(String key, JSONObject value) {
        try { 
            delegate.put(key, ((org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate)value).delegate);
        } catch (Exception ex) {
            // Squelch, should never throw anyway.  
        }
        return this;
    }

    public JSONObject put(String key, short value) {
        try { 
            delegate.put(key, value);
        } catch (Exception ex) {
            // Squelch, should never throw anyway.  
        }
        return this;
    }

    public JSONObject put(String key, Map value) throws JSONException{
        try {
            delegate.put(key, value);
        } catch (Exception ex){
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
        return this;
    }

    public JSONObject put(String key, Object value) throws JSONException {
        if(value == null) {
            try { 
                delegate.put(key, value);
            } catch (Exception ex) {
                JSONException jex = new JSONException(ex.getMessage());
                jex.initCause(ex);
                throw jex;
            }
        } else {
            try{
                Class clazz = value.getClass();
                if (org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate.class.isAssignableFrom(clazz)) {
                    this.delegate.put(key, ((org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate)value).delegate);
                } else if (org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate.class.isAssignableFrom(clazz)) {
                    this.delegate.put(key, ((org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate)value).delegate);
                } else if (Number.class.isAssignableFrom(clazz)) {
                    this.delegate.put(key, value);
                } else if (Boolean.class.isAssignableFrom(clazz)) {
                    this.delegate.put(key, value);
                } else if (String.class.isAssignableFrom(clazz)) {
                    this.delegate.put(key, value);
                }
            } catch (Exception ex) {
                JSONException jex = new JSONException(ex.getMessage());
                jex.initCause(ex);
                throw jex;
            }
        }
        return this;
    }

    public Object remove(String key) {
        return null;
    }

    // ------- utility methods -------	

    public boolean has(String key) {
        return delegate.has(key);
    }

    public boolean isNull(String key) {
        return delegate.isNull(key);
    }

    public Iterator keys() {
        return delegate.keys();
    }

    public Iterator sortedKeys() {
        return delegate.sortedKeys();
    }

    public int length() {
        return delegate.length();
    }

    public JSONArray names() {
        return null;
    }

    public String toString() {
        return delegate.toString();
    }

    public String toString(int indent) {
        try {
            return delegate.toString(indent);
        } catch (Exception ex){
            return "JSON Serialization error: [" + ex.getMessage() + "]";
        }
    }

    public Writer write(Writer w) throws JSONException {
        try {
            delegate.write(w);
        } catch (Exception ex){
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
        return w;
    }
}
