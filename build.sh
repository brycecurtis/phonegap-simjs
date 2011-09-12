#!/bin/sh

cd bin
jar cvf ../WebContent/sim/phonegapApplet.jar *
jarsigner ../WebContent/sim/phonegapApplet.jar PhoneGap

cd ..