# PhoneGap Simulator #
by IBM

The PhoneGap simulator enables a developer to write and debug PhoneGap applications using a desktop web browser.  Since browser tools currently provide greater development capabilities than mobile web tools, a mobile developer can leverage existing browser tools already available for web development to simplify the PhoneGap development process.

The simulator supports APIs for all PhoneGap functions to enable development and debug of applications without the need a mobile SDK installed on your system.  Once your application is working in the simulator, you can submit it to the PhoneGap build service (http://build.phonegap.com) or build it using the appropriate mobile SDK.

The simulator is not a substitute for using the mobile SDK, but it does allow for more rapid development and debug of PhoneGap applications.  It can also be used to isolate some developers working on the web content from those developers that have access to a mobile SDK.

## Software requirements ##

* It has only been tested on Mac Safari, with the goal to run on Chrome and Firefox as well.
* Java applets must be enabled in browser.

## Using simulator ##

The simulator consists of web content located under the "WebContent" directory.

* sim.html - simulator file to be loaded into your browser (file:///<path>/WebContent/sim.html)
* phonegap.js - include this in your PhoneGap app HTML file
* sim/* - simulator files includes HTML content for controls and simulates native phonegap implementation
* phonegap/* - phonegap JavaScript API implementation
  
The remaining files make up your PhoneGap application.  An example app is included.

* index.html - your PhoneGap application.  The provided demo includes a list of PhoneGap test apps.
* dojo/* - mobile Dojo used by test apps.
* screens/* - PhoneGap test apps.

Some simulator functions cannot be simulated using only JavaScript, so Java applets are used to provide functionality.  The applet code is located under the "src" dirctory.  The applet code is patterned after the Android code, so to enable the Android Java code to be used with minor modifications in an applet environment, a few android classes were stubbed out.  A JSON library is also included, along with commons-codec.jar used for Android.

* android/* - Android stubbed classes.
* org.apache.commons/* - commons-codec.jar source
* org.apache.wink/* - JSON library source
* com.phonegap.applet/* - Applet source
* com.phonegap.* - Modified PhoneGap code as needed from Android implementation

The applet is compiled using the "build.sh" script and copied into the "WebContent/sim" directory.  You don't need to run this script unless you change the applet source code.


## RELEASE NOTES ##

### 20110912 ###
* Initial release

## BUGS AND CONTRIBUTIONS ##

Patches welcome! Send a pull request.  Requires a [CLA](https://files.pbworks.com/download/qH1OfztZ1d/phonegap/31724031/NitobiPhoneGapCLA.pdf).

Post issues in the [PhoneGap Google Groups](http://groups.google.com/group/phonegap), include in the subject heading - "PhoneGap Simulator" or on [Github](http://github.com/brycecurtis/phonegap-simjs/issues)
(preferred)

## LICENSE ##

The MIT License

Copyright (c) 2011 IBM

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
