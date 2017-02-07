# PantryProject
Mobile application for tracking pantry items and suggesting recipes.

# Cloning
###Not sure if this is actually working haven't tested this yet

You will need to make sure you have Ionic and Cordova installed using
`npm install -g ionic cordova`

Then clone the repository and change directory into the cloned folder

Then run the following to restore packages
`npm install`

~~And then run the following to restore ionic~~
~~`ionic state restore`~~

You should be able to test now.
You can also add which platforms you want to work with using
`ionic platform add $platform` and either ios or android

Don't forget to add required plugins:
$ ionic plugin add cordova-plugin-inappbrowser
$ ionic plugin add cordova-sqlite-storage
$ ionic plugin install cordova-plugin-whitelist
$ ionic plugin add phonegap-plugin-barcodescanner

Make sure that you have the required tools for each platform

Resources can be found at [Ionic](http://ionicframework.com/docs/)
