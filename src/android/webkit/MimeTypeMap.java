package android.webkit;

import java.util.HashMap;
import java.util.Map;

public class MimeTypeMap {

	private static MimeTypeMap instance = new MimeTypeMap();
    private static final Map<String, String> mimeTypes = new HashMap<String, String>();
    static {
    	mimeTypes.put(".jpg", "image/jpeg");
    	mimeTypes.put(".gif", "image/gif");
    	mimeTypes.put(".png", "image/png");
    	mimeTypes.put(".mp3", "audio/mpeg3");
    	mimeTypes.put(".mpg", "video/mpeg");
    	mimeTypes.put(".wav", "audio/wav");    	
    }
	
	private MimeTypeMap() {}
	
	public static MimeTypeMap getSingleton() {
		return instance;
	}

	public String getFileExtensionFromUrl(String filename) {
		return filename.substring(filename.lastIndexOf("."));
	}

	public String getMimeTypeFromExtension(String fileExtensionFromUrl) {
		return mimeTypes.get(fileExtensionFromUrl);
	}

}
