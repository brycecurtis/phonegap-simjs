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

import java.io.IOException;

/**
 *
 */
public interface JSONWriter {

    public JSONWriter array() throws IOException, IllegalStateException;

    public JSONWriter endArray() throws IOException, IllegalStateException;

    public JSONWriter endObject() throws IOException, IllegalStateException;

    public JSONWriter key(String s) throws IOException, IllegalStateException;

    public JSONWriter object() throws IOException, IllegalStateException;

    public JSONWriter value(boolean b) throws IOException, IllegalStateException;

    public JSONWriter value(double d) throws IOException, IllegalStateException;

    public JSONWriter value(long l) throws IOException, IllegalStateException;

    public JSONWriter value(short s) throws IOException, IllegalStateException;

    public JSONWriter value(Object o) throws IOException, IllegalStateException, JSONException;

    public void close() throws IOException, IllegalStateException;

    public JSONWriter flush() throws IOException;
}
