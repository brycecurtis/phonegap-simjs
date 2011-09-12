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

import java.io.IOException;
import java.io.Writer;

import org.apache.wink.json4j.compat.JSONException;
import org.apache.wink.json4j.compat.JSONWriter;

/**
 *
 */
public class ApacheJSONWriterDelegate implements JSONWriter {

    protected org.apache.wink.json4j.JSONWriter delegate = null;

    protected Writer writer = null;

    public ApacheJSONWriterDelegate(Writer writer) {
        this.delegate = new org.apache.wink.json4j.JSONWriter(writer);
        this.writer = writer;
    }

    public JSONWriter object() throws IOException, IllegalStateException {
        delegate.object();
        return this;
    }
    public JSONWriter array() throws IOException, IllegalStateException {
        delegate.array();
        return this;
    }

    public JSONWriter endArray() throws IOException, IllegalStateException {
        delegate.endArray();
        return this;
    }

    public JSONWriter endObject() throws IOException, IllegalStateException {
        delegate.endObject();
        return this;
    }

    public JSONWriter key(String s) throws IOException, IllegalStateException {
        delegate.key(s);
        return this;
    }

    public JSONWriter value(boolean b) throws IOException, IllegalStateException {
        delegate.value(b);
        return this;
    }

    public JSONWriter value(double d) throws IOException, IllegalStateException {
        delegate.value(d);
        return this;
    }

    public JSONWriter value(long l) throws IOException, IllegalStateException {
        delegate.value(l);
        return this;
    }

    public JSONWriter value(short s) throws IOException, IllegalStateException {
        delegate.value(s);
        return this;
    }

    public JSONWriter value(Object obj) throws IOException, IllegalStateException, JSONException {
        try{
            if (obj == null) {
                delegate.value((Object)null);
            } else {
                Class clazz = obj.getClass();
                if (org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate.class.isAssignableFrom(clazz)) {
                    this.delegate.value(((org.apache.wink.json4j.compat.impl.ApacheJSONObjectDelegate)obj).delegate);
                } else if (org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate.class.isAssignableFrom(clazz)) {
                    this.delegate.value(((org.apache.wink.json4j.compat.impl.ApacheJSONArrayDelegate)obj).delegate);
                }else if (Number.class.isAssignableFrom(clazz)) {
                    this.delegate.value(obj);
                } else if (Boolean.class.isAssignableFrom(clazz)) {
                    this.delegate.value(obj);
                } else if (String.class.isAssignableFrom(clazz)) {
                    this.delegate.value(obj);
                }
            }
            return this;
        } catch (Exception ex) {
            if(ex instanceof IOException){
                throw (IOException)ex;
            } else if (ex instanceof IllegalStateException) {
                throw (IllegalStateException)ex;
            } else {
                JSONException jex = new JSONException(ex.getMessage());
                jex.initCause(ex);
                throw jex;
            }
        }
    }

    public void close() throws IOException, IllegalStateException {
        delegate.close();
    }

    public JSONWriter flush() throws IOException {
        delegate.flush();
        return this;
    }

}
