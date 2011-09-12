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
import java.util.Map;

import org.apache.wink.json4j.compat.JSONArray;
import org.apache.wink.json4j.compat.JSONException;
import org.apache.wink.json4j.compat.JSONObject;

/**
 *
 */
public class ApacheJSONArrayDelegate implements JSONArray {

    protected org.apache.wink.json4j.JSONArray delegate = null;

    public ApacheJSONArrayDelegate() {
        delegate = new org.apache.wink.json4j.JSONArray();
    }

    public ApacheJSONArrayDelegate(org.apache.wink.json4j.JSONArray jArray) {
        delegate = jArray;
    }

    // ------- data accessor methods -------
    public Object get(int index) {
        try {
            Object obj = this.delegate.get(index);
            if (obj == null) {
                return null;
            } else {
                Class clazz = obj.getClass();
                if (org.apache.wink.json4j.JSONObject.class.isAssignableFrom(clazz)) {
                    return new ApacheJSONObjectDelegate((org.apache.wink.json4j.JSONObject)obj);
                } else if (org.apache.wink.json4j.JSONArray.class.isAssignableFrom(clazz)) {
                    return new ApacheJSONArrayDelegate((org.apache.wink.json4j.JSONArray)obj);
                } else if (Number.class.isAssignableFrom(clazz)) {
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

    public boolean getBoolean(int index) throws JSONException {
        try {
            return delegate.getBoolean(index); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public double getDouble(int index) throws JSONException {
        try {
            return delegate.getDouble(index); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public int getInt(int index) throws JSONException {
        try {
            return delegate.getInt(index); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public long getLong(int index) throws JSONException {
        try {
            return delegate.getLong(index); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    } 

    public short getShort(int index) throws JSONException {
        try {
            return delegate.getShort(index); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    } 

    public String getString(int index) throws JSONException {
        try {
            return delegate.getString(index); 
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray getJSONArray(int index) throws JSONException {
        try {
            org.apache.wink.json4j.JSONArray obj = delegate.getJSONArray(index); 
            if (obj == null) {
                return null;
            }
            return new ApacheJSONArrayDelegate(obj);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONObject getJSONObject(int index) throws JSONException {
        try {
            org.apache.wink.json4j.JSONObject obj = delegate.getJSONObject(index); 
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


    // ------- modifier methods -------	

    public String join(String separator) {
        return delegate.join(separator);
    }

    public JSONArray put(boolean value) {
        delegate.put(value);
        return this;
    }

    public JSONArray put(double value) {
        delegate.put(value);
        return this;
    }

    public JSONArray put(int value) {
        delegate.put(value);
        return this;
    }

    public JSONArray put(short value) {
        delegate.put((short)value);
        return this;
    }

    public JSONArray put(Collection value) throws JSONException {
        try {
            delegate.put(value);
            return this;
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray put(int index, boolean value) throws JSONException {
        try {
            delegate.put(index,value);
            return this;
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray put(int index, Collection value) throws JSONException {
        try {
            delegate.put(index,value);
            return this;
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray put(int index, double value) throws JSONException {
        try {
            delegate.put(index,value);
            return this;
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray put(int index, int value) throws JSONException {
        try {
            delegate.put(index,value);
            return this;
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray put(int index, long value) throws JSONException {
        try {
            delegate.put(index,value);
            return this;
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray put(int index, short value) throws JSONException {
        try {
            delegate.put(index,(short)value);
            return this;
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray put(int index, Map value) throws JSONException {
        try {
            delegate.put(index,value);
            return this;
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray put(int index, Object value) throws JSONException {
        try {
            if (value == null) {
                this.delegate.put(index, value);
            } else {
                Class clazz = value.getClass();
                if (org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate.class.isAssignableFrom(clazz)) {
                    this.delegate.put(index, ((org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate)value).delegate);
                } else if (org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate.class.isAssignableFrom(clazz)) {
                    this.delegate.put(index, ((org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate)value).delegate);
                } else if (Number.class.isAssignableFrom(clazz)) {
                    this.delegate.put(index, value);
                } else if (Boolean.class.isAssignableFrom(clazz)) {
                    this.delegate.put(index, value);
                } else if (String.class.isAssignableFrom(clazz)) {
                    this.delegate.put(index, value);
                }
            }
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
        return this;
    }

    public JSONArray put(long value) {
        delegate.put(value);
        return this;
    }

    public JSONArray put(Map value) throws JSONException {
        try {
            delegate.put(value);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
        return this;
    }

    public JSONArray put(Object value) throws JSONException {
        try {
            if (value == null) {
                this.delegate.put(value);
            } else {
                Class clazz = value.getClass();
                if (org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate.class.isAssignableFrom(clazz)) {
                    this.delegate.put(((org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate)value).delegate);
                } else if (org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate.class.isAssignableFrom(clazz)) {
                    this.delegate.put(((org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate)value).delegate);
                } else if (Number.class.isAssignableFrom(clazz)) {
                    this.delegate.put(value);
                } else if (Boolean.class.isAssignableFrom(clazz)) {
                    this.delegate.put(value);
                } else if (String.class.isAssignableFrom(clazz)) {
                    this.delegate.put(value);
                }
            }
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
        return this;
    }

    public Object remove(int index) {
        try {
            Object obj = this.delegate.remove(index);
            if (obj == null) {
                return null;
            } else {
                Class clazz = obj.getClass();
                if (org.apache.wink.json4j.JSONObject.class.isAssignableFrom(clazz)) {
                    return new ApacheJSONObjectDelegate((org.apache.wink.json4j.JSONObject)obj);
                } else if (org.apache.wink.json4j.JSONArray.class.isAssignableFrom(clazz)) {
                    return new ApacheJSONArrayDelegate((org.apache.wink.json4j.JSONArray)obj);
                } else if (Number.class.isAssignableFrom(clazz)) {
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

    // ------- utility methods -------	

    public boolean isNull(int index) {
        return delegate.isNull(index);
    }

    public int length() {
        return delegate.length();
    }

    // ------- output methods -------

    public String toString() {
        return delegate.toString();
    }

    public String toString(int indent) {
        try {
            return delegate.toString(indent);
        } catch (Exception ex) {
            return "JSON Serializarion error: [" + ex.getMessage() + "]";
        }
    }

    public Writer write(Writer w) throws JSONException {
        try {
            delegate.write(w);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
        return w;
    }
}
