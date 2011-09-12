package com.phonegap.applet;

import java.applet.Applet;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.AccessController;
import java.security.PrivilegedAction;

import org.apache.wink.json4j.JSONArray;
//import org.apache.wink.json4j.JSONException;

import android.os.Environment;

import com.phonegap.FileUtils;
import com.phonegap.api.PluginResult;
//import netscape.javascript.*;
//import org.w3c.dom.*;
//import org.w3c.dom.html.*;
//import com.sun.java.browser.dom.*;

/**
 * This class simulates a file system.
 *  
 */
public class FileApplet extends Applet {

	private static final long serialVersionUID = -3597778569502049410L;
	private FileUtils fileUtils;
	
	/**
	 * File applet constructor
	 */
	public FileApplet() {
		System.out.println ("File: Constructor");
		fileUtils = new FileUtils();
	}
	
	public String getAppletInfo() {
		return ("Written by: Bryce Curtis, (c) 2011, IBM Corporation");
	}
	
	/**
	 * Applet init. Send fileAppletInit event to JavaScript
	 */
	public void init()	{
		System.out.println ("File: init");
		
		//DOMService service = null;
		
		//JSObject window = JSObject.getWindow(this);
		
		try {
		      getAppletContext().showDocument(new URL("javascript:fireDocumentEvent('fileAppletInit', '')"));
		}
		catch (MalformedURLException me) { }
	}
	
	public void start() {
		System.out.println ("File: start");
		try {
		      getAppletContext().showDocument(new URL("javascript:fireDocumentEvent('fileAppletStart', '')"));
		}
		catch (MalformedURLException me) { }
	}
	
	public void stop()	{
		System.out.println ("File: stop");
	}
	
	public void destroy() {
		System.out.println ("File: destroy");
	}
	
	/**
	 * Executes the request and returns PluginResult.
	 * 
	 * @param action 		The action to execute.
	 * @param args 			Stringified JSONArry of arguments for the plugin.
	 * @param callbackId	The callback id used when calling back into JavaScript.
	 * @return 				A PluginResult object with a status and message.
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public String exec(final String action, final String jsonArgs, final String callbackId) {
		System.out.println("************* File: exec("+action+","+jsonArgs+","+callbackId+")");
		String res = AccessController.doPrivileged(new PrivilegedAction() {
			public Object run() {
				try {
					final JSONArray args = new JSONArray(jsonArgs);
					PluginResult r = fileUtils.execute(action, args, callbackId);
					r.id = callbackId;
					String s = r.getJSONString();
					System.out.println(" - returning "+s);
					return s;
				} catch (Exception e) {
					System.out.println("File: ERROR: ");
					e.printStackTrace();
				}
				return "";
			}
		});
		return res;
	}
	
	/**
	 * Return directory listing.
	 * This is used by the simulator control to display the file tree.
	 * 
	 * @param path
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public String dir(final String path) {
		System.out.println("************* File: dir("+path+")");
		@SuppressWarnings("unchecked")
		String s = AccessController.doPrivileged(new PrivilegedAction() {
			String basePath = null;
			int basePathLen = 0;
			int id = 0;
			
			public Object run() {
				StringBuffer sb = new StringBuffer();
				sb.append("[");

				try {
					basePath = Environment.getExternalStorageDirectory().getCanonicalPath() + "/filesystem";
					if (path.length() > 0) {
						basePath = basePath + "/" + path;
					}
					basePathLen = basePath.length();
					System.out.println(" -- basePath="+basePath);
					File f = new File(basePath);
					this.visitAllDirsAndFiles(f, sb);
				} 
				// TODO:
				catch (IOException e) {
					e.printStackTrace();
					return "FAILED";
				}
				sb.append("]");
				System.out.println(" - returning "+sb.toString());
				return sb.toString();
			}

			private void visitAllDirsAndFiles(File f, StringBuffer sb) {
				String name = f.getAbsolutePath().substring(basePathLen);
				if (name.startsWith("/persistent") || name.startsWith("/temp")) {
					int type = 1;
					if (f.isDirectory()) {
						type = 2;
					}
					if (id > 0) {
						sb.append(",");
					}
					sb.append("{id:"+id);
					sb.append(",name:\""+name.substring(1)+"\"");
					sb.append(",type:" + type);
					sb.append("}");
					id++;
				}
			    if (f.isDirectory()) {
			        String[] children = f.list();
			        for (int i=0; i<children.length; i++) {
			            visitAllDirsAndFiles(new File(f, children[i]), sb);
			        }
			    }
			}
		});
		return s;
	}	
}
