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
import java.util.Map;

/**
 *
 */
public interface JSONArray {
	
	// ------- data accessor methods -------
	public Object get(int index) throws JSONException;
	
	public boolean getBoolean(int index) throws JSONException;
	
	public double getDouble(int index) throws JSONException;
	
	public int getInt(int index) throws JSONException;
	
	public long getLong(int index) throws JSONException;

        public short getShort(int index) throws JSONException;
	
	public String getString(int index) throws JSONException;
	
	public JSONArray getJSONArray(int index) throws JSONException;
	
	public JSONObject getJSONObject(int index) throws JSONException;
	
	// ------- modifier methods -------	
	
	public String join(String separator);
	
	public JSONArray put(boolean value);
	
	public JSONArray put(Collection value) throws JSONException ;
	
	public JSONArray put(double value);
	
	public JSONArray put(int value);
	
	public JSONArray put(int index, boolean value) throws JSONException;

	public JSONArray put(int index, Collection value) throws JSONException;
	
	public JSONArray put(int index, double value) throws JSONException;	
	
	public JSONArray put(int index, int value) throws JSONException;
	
	public JSONArray put(int index, long value) throws JSONException;
        
        public JSONArray put(int index, short value) throws JSONException;
	
	public JSONArray put(int index, Map value) throws JSONException;
	
	public JSONArray put(int index, Object value) throws JSONException;
		
	public JSONArray put(long value);
        
        public JSONArray put(short value);
	
	public JSONArray put(Map value) throws JSONException ;
	
	public JSONArray put(Object value) throws JSONException ;
	
	public Object remove(int index);
	
	// ------- utility methods -------	
	
	public boolean isNull(int index);
	
	public int length();
	
	// ------- output methods -------
	
	public String toString();
	
	public String toString(int indent);
	
	public Writer write(Writer w) throws JSONException;
}
