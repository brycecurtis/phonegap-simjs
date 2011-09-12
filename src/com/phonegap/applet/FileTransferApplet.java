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

import com.phonegap.FileTransfer;
import com.phonegap.api.PluginResult;

/**
 * This class simulates a file system.
 *  
 */
public class FileTransferApplet extends Applet {

	private static final long serialVersionUID = -3597778569502049410L;
	private FileTransfer fileTransfer;
	
	/**
	 * File applet constructor
	 */
	public FileTransferApplet() {
		System.out.println ("FileTransfer: Constructor");
		fileTransfer = new FileTransfer();
	}
	
	public String getAppletInfo() {
		return ("Written by: Bryce Curtis, (c) 2011, IBM Corporation");
	}
	
	/**
	 * Applet init. Send fileAppletInit event to JavaScript
	 */
	public void init()	{
		System.out.println ("FileTransfer: init");
	}
	
	public void start() {
		System.out.println ("FileTransfer: start");
	}
	
	public void stop()	{
		System.out.println ("FileTransfer: stop");
	}
	
	public void destroy() {
		System.out.println ("FileTransfer: destroy");
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
		System.out.println("************* FileTransfer: exec("+action+","+jsonArgs+","+callbackId+")");
		String res = AccessController.doPrivileged(new PrivilegedAction() {
			public Object run() {
				try {
					final JSONArray args = new JSONArray(jsonArgs);
					PluginResult r = fileTransfer.execute(action, args, callbackId);
					r.id = callbackId;
					String s = r.getJSONString();
					System.out.println(" - returning "+s);
					return s;
				} catch (Exception e) {
					System.out.println("FileTransfer: ERROR: ");
					e.printStackTrace();
				}
				return "";
			}
		});
		return res;
	}	
}
