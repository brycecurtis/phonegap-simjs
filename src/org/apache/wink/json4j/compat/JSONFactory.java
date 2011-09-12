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

package org.apache.wink.json4j.compat;

import java.io.Reader;
import java.io.Writer;
import java.util.Collection;
import java.util.Map;

public abstract class JSONFactory {
	
	public static final JSONFactory newInstance() {
		String factory = System.getProperty("org.apache.wink.common.model.json.factory.impl");
		if (factory != null && factory.length() > 0) {
                    try {
                        Class clazz = Class.forName(factory);
                        return (JSONFactory)clazz.newInstance();

                    } catch (Throwable th) {
                        // Ignore
                        th.printStackTrace();
                    }
		}
		return null;
	}
	
	public abstract JSONArray createJSONArray();
	
	public abstract JSONArray createJSONArray(Collection collection) throws JSONException;
	
	public abstract JSONArray createJSONArray(Collection collect, boolean useSuperClass) throws JSONException;
	
	public abstract JSONArray createJSONArray(Reader reader) throws JSONException;
	
	public abstract JSONArray createJSONArray(Object array) throws JSONException;
	
	public abstract JSONArray createJSONArray(Object array, boolean useSuperClass) throws JSONException;
	
	public abstract JSONArray createJSONArray(String src) throws JSONException;

	public abstract JSONObject createJSONObject();
	
        public abstract JSONObject createJSONObject(Reader reader) throws JSONException;
	
	public abstract JSONObject createJSONObject(Map m) throws JSONException;

	public abstract JSONObject createJSONObject(Map m, boolean useSuperClass) throws JSONException;
	
	public abstract JSONObject createJSONObject(Object obj) throws JSONException;
	
	public abstract JSONObject createJSONObject(Object obj, boolean useSuperClass) throws JSONException;
	
	public abstract JSONObject createJSONObject(Object obj, String[] names) throws JSONException;
	
	public abstract JSONObject createJSONObject(String src) throws JSONException;
	
	public abstract JSONStringer createJSONStringer();
	
	public abstract JSONWriter createJSONWriter(Writer writer);
	
}
