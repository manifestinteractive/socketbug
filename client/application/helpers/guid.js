/**
 * Socketbug - Web Socket Remote Debugging
 * 
 * Copyright (c) 2011 Manifest Interactive, LLC
 *
 * Licensed under the LGPL v3 licenses.
 *
 * @version v0.2.1 ( 7/4/2011 )
 *
 * @author <a href="http://www.socketbug.com">Website</a>
 * @author <a href="http://www.vimeo.com/user7532036/videos">Video Tutorials ( HD )</a>
 * @author <a href="http://www.twitter.com/socketbug_dev">Twitter</a>
 * @author <a href="http://github.com/manifestinteractive/socketbug">Source Code</a>
 * @author <a href="http://socketbug.userecho.com">Support & Feature Requests</a>
 */

var GUID={is_valid:function(value){if(typeof(value)=='undefined'){return false;}if(value.length!==36){return false;}rGx=new RegExp("\\b(?:[A-F0-9]{8})(?:-[A-F0-9]{4}){3}-(?:[A-F0-9]{12})\\b");return (rGx.exec(value)!=null);},create:function(){if(arguments.length==1&&this.is_valid(arguments[0])){value=arguments[0];return value;}var res=[];var hv;var rgx=new RegExp("[2345]");for(var i=0;i<8;i++){hv=(((1+Math.random())*0x10000)|0).toString(16).substring(1);if(rgx.exec(i.toString())!=null){if(i==3){hv="6"+hv.substr(1,3);}res.push("-");}res.push(hv.toUpperCase());}value=res.join('');return value;}};