**MENU:**&nbsp;&nbsp;&nbsp;[HOME](https://github.com/manifestinteractive/socketbug/wiki)  &nbsp;&middot;&nbsp;  [SERVER](https://github.com/manifestinteractive/socketbug/wiki/Install-Server)  &nbsp;&middot;&nbsp;  [APPLICATION](https://github.com/manifestinteractive/socketbug/wiki/Install-Application)  &nbsp;&middot;&nbsp;  [CONSOLE](https://github.com/manifestinteractive/socketbug/wiki/Install-Console)

---

# [NOT MAITAINED]

#Socketbug Introduction Video

###! [Watch our 3 Minute Teaser Video](http://www.vimeo.com/socketbug/teaser)

###! [Watch our Full 10 Minute Socketbug Introduction Video](http://www.vimeo.com/socketbug/introduction)

We'll show you the good stuff before you do any work :)

#Socketbug Requirements

 * [**Node.js** ( v0.4+ )](http://nodejs.org/ "Check out Node.js")

 * [**Socket.IO** ( v0.7+ )](http://socket.io/ "Check out Node.js")

 * **Knowledge on how to use git** ( [Linux](http://help.github.com/mac-set-up-git/), [Mac OSX](http://help.github.com/linux-set-up-git), or  [Windows](http://help.github.com/win-set-up-git) )

 * **Knowledge on how to use a Terminal Window**

But not to worry, our Installation Instructions will get you setup with the required libraries.  And our video should help most through any terminal issues ;)

#Socketbug - What is it?

The technology behind Mobile Web Applications has been growing at a tremendous rate.  Mobile Application Developers, while able to produce amazing applications, are limited by the native browsers own limited functionality. Basic features available on desktop browsers are completely absent from mobile browsers. The ability to view source code, debug javascript, or even execute a javascript command from a console are all tools developers have come to expect while developing websites.  So why are these features lacking for mobile web application developers?

This is where Socketbug fills the gap! Socketbug is a Remote Debugging Utility built using [Socket.IO](http://socket.io "Socket.IO"). This means you can now use modern browsers ( both mobile and desktop ) to work together to allow you to remotely debug you mobile web applications.

#Debugging your Mobile Applications with Socketbug

Socketbug is built on top of [Node.js](http://nodejs.org/ "Check out Node.js") using [Socket.IO](http://socket.io/ "Check out Node.js") (currently v0.7) as the main backend for communication. Socket.IO automatically determines what communication transport to use and enables your mobile application to send/receive messages from other connected devices.

To use Socketbug you will need to install our server code in a central location that will be accessible by all devices that will be sending or receiving data.  This can be anything from your laptop/desktop, or a remote server.  There are no Cross Domain issues to worry about so you do not have to have Socketbug installed on the same machine that your mobile application is installed on.

To make things easy, Socketbug also has a native console that was created for you to connect to your Socketbug Server.  Once your server is installed you should literally just need to copy some javascript code into your Mobile Application, and then open up the Socketbug Console.
