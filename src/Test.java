
import java.applet.Applet;

public class Test extends Applet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3597778569502049410L;

	public Test ()
	{
		System.out.println ("PhoneGap Applet: Test Constructor");
	}
	public String getAppletInfo ()
	{
		return ("Written by: Bryce Curtis, (c) 2011, IBM Corporation");
	}
	public void init ()
	{
		System.out.println ("PhoneGap: init");
		
	}
	public void start ()
	{
		System.out.println ("PhoneGap: start");
	}
	public void stop ()
	{
		System.out.println ("PhoneGap: stop");
	}
	public void destroy ()
	{
		System.out.println ("PhoneGap: destroy");
	}
	public String test() {
		return "From Applet!";
	}
}
