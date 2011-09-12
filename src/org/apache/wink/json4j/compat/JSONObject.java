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

import java.io.Writer;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

/**
 *	 
 */
public interface JSONObject {
	// ------- data accessor methods -------
	public Object get(String key);
	
	public boolean getBoolean(String key) throws JSONException; 
	
	public double getDouble(String key) throws JSONException;
	
	public int getInt(String key) throws JSONException;
        
        public short getShort(String key) throws JSONException;
	
	public long getLong(String key) throws JSONException;
	
	public JSONArray getJSONArray(String key) throws JSONException;
	
	public JSONObject getJSONObject(String key) throws JSONException;
	
	public String getString(String key) throws JSONException;
	
	
	// ------- modifier methods -------	
	
	public JSONObject append(String key, Object value) throws JSONException;
	
	public JSONObject put(String key, boolean value);
	
	public JSONObject put(String key, Collection value) throws JSONException;
	
	public JSONObject put(String key, double value);
	
	public JSONObject put(String key, int value);
	
	public JSONObject put(String key, long value);
        
        public JSONObject put(String key, short value);
	
	public JSONObject put(String key, Map value) throws JSONException;
	
	public JSONObject put(String key, Object value) throws JSONException;
	
	public Object remove(String key);
	
	// ------- utility methods -------	
	
	public boolean has(String key);
	
	public boolean isNull(String key);
	
	public Iterator keys();
	
	public Iterator sortedKeys();
	
	public int length();
	
	public JSONArray names();
		
	// ------- output methods -------	
	
        public String toString();
	
	public String toString(int indent);
	
	public Writer write(Writer w) throws JSONException;
}
