package android.os;

import java.io.File;

public class Environment {

	public static final String MEDIA_MOUNTED = "mounted";
	public static File storage = null;

	public static File getExternalStorageDirectory() {

		if (storage == null) {
			storage = new File(System.getProperty("user.home") + "/phonegap"); 
			try {
				System.out.println ("External storage dir: " + storage.getCanonicalPath());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return storage;
	}

	public static String getExternalStorageState() {
		return MEDIA_MOUNTED;
	}

}
