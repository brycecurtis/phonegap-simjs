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

import java.io.Reader;
import java.io.Writer;
import java.util.Collection;
import java.util.Map;

import org.apache.wink.json4j.compat.JSONArray;
import org.apache.wink.json4j.compat.JSONException;
import org.apache.wink.json4j.compat.JSONFactory;
import org.apache.wink.json4j.compat.JSONObject;
import org.apache.wink.json4j.compat.JSONStringer;
import org.apache.wink.json4j.compat.JSONWriter;

public class ApacheJSONFactory extends JSONFactory{
    public JSONArray createJSONArray(){
        org.apache.wink.json4j.JSONArray jArray = new org.apache.wink.json4j.JSONArray();
        return new org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate(jArray);
    }

    public JSONArray createJSONArray(Collection collection) throws JSONException {
        try {
            org.apache.wink.json4j.JSONArray jArray = new org.apache.wink.json4j.JSONArray(collection);
            return new org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate(jArray);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }


    public JSONArray createJSONArray(Collection collect, boolean useSuperClass) throws JSONException{
        //TODO:  Really implement this!
        try {
            org.apache.wink.json4j.JSONArray jArray = new org.apache.wink.json4j.JSONArray(collect);
            return new org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate(jArray);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray createJSONArray(Reader reader) throws JSONException {
        try {
            org.apache.wink.json4j.JSONArray jArray = new org.apache.wink.json4j.JSONArray(reader);
            return new org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate(jArray);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONArray createJSONArray(Object array) throws JSONException {
        return null;
    }

    public JSONArray createJSONArray(Object array, boolean useSuperClass) throws JSONException {
        return null;
    }

    public JSONArray createJSONArray(String src) throws JSONException {
        try {
            org.apache.wink.json4j.JSONArray jArray = new org.apache.wink.json4j.JSONArray(src);
            return new org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate(jArray);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONObject createJSONObject() {
        org.apache.wink.json4j.JSONObject jObj = new org.apache.wink.json4j.JSONObject();
        return new org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate(jObj);
    }

    public JSONObject createJSONObject(Reader reader) throws JSONException {
        try {
            org.apache.wink.json4j.JSONObject jObj = new org.apache.wink.json4j.JSONObject(reader);
            return new org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate(jObj);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONObject createJSONObject(Map m) throws JSONException {
        try {
            org.apache.wink.json4j.JSONObject jObj = new org.apache.wink.json4j.JSONObject(m);
            return new org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate(jObj);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONObject createJSONObject(Map m, boolean useSuperClass) throws JSONException {
        try {
            org.apache.wink.json4j.JSONObject jObj = new org.apache.wink.json4j.JSONObject(m);
            return new org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate(jObj);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONObject createJSONObject(Object obj)  throws JSONException {
        try {
            org.apache.wink.json4j.JSONObject jObj = new org.apache.wink.json4j.JSONObject();
            return new org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate(jObj);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONObject createJSONObject(Object obj, boolean useSuperClass) throws JSONException {
        // TODO:  Implement this.
        try {
            org.apache.wink.json4j.JSONObject jObj = new org.apache.wink.json4j.JSONObject();
            return new org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate(jObj);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONObject createJSONObject(Object obj, String[] names) throws JSONException {
        // TODO:  Implement this.
        try {
            org.apache.wink.json4j.JSONObject jObj = new org.apache.wink.json4j.JSONObject();
            return new org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate(jObj);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONObject createJSONObject(String src) throws JSONException {
        try {
            org.apache.wink.json4j.JSONObject jObj = new org.apache.wink.json4j.JSONObject(src);
            return new org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate(jObj);
        } catch (Exception ex) {
            JSONException jex = new JSONException(ex.getMessage());
            jex.initCause(ex);
            throw jex;
        }
    }

    public JSONStringer createJSONStringer() {
        return new org.apache.wink.json4j.compat.impl.ApacheJSONStringerDelegate();
    }

    public JSONWriter createJSONWriter(Writer writer) {
        return new org.apache.wink.json4j.compat.impl.ApacheJSONWriterDelegate(writer);
    }
}
