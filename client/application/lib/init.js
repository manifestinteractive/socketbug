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

var helpers = (typeof(_sbs.helpers) != 'undefined') ? _sbs.helpers:new Array();
var libraries = (typeof(_sbs.libraries) != 'undefined') ? _sbs.libraries:new Array();
var plugins = (typeof(_sbs.plugins) != 'undefined') ? _sbs.plugins:new Array();

require(
	/* Set Base URL Path */
	{ 
		baseUrl: sb_base
	},
	
	/* Load Required Files First */
	[
		'helpers/debug',
		'helpers/guid',
		'helpers/md5'
	],
	
	/* Set Callback to Check for Helpers, Libraries & Plugins */
	function()
	{
		load_helpers();
	}
);

/* Load Helpers found in Config */
function load_helpers()
{
	if(helpers.length != 0)
	{
		/* Load Helpers and then load Libraries */
		require({ baseUrl: sb_base }, helpers, function ()
		{ 
			load_libraries(); 
		});	
	}
	/* No Helpers, load Socket.IO */
	else
	{
		load_libraries();
	}
};

/* Load Libraries found in Config */
function load_libraries()
{
	if(libraries.length != 0)
	{
		/* Load Libraries and then load Plugins */
		require({ baseUrl: sb_base }, libraries, function ()
		{ 
			load_plugins(); 
		});	
	}
	/* No Libraries, load Plugins */
	else
	{
		load_plugins();
	}
};

/* Load Plugins found in Config */
function load_plugins()
{
	if(plugins.length != 0)
	{
		/* Load Plugins and then load Socket.IO */
		require({ baseUrl: sb_base }, plugins, function ()
		{ 
			load_socketbug(); 
		});	
	}
	/* No Plugins, load Socket.IO */
	else
	{
		load_socketbug();
	}
};

/* Function to Load Socketbug Core */
function load_socketbug()
{
	/* Load Socket.IO from Config Path */
	require([_sbs.host+':'+_sbs.port+'/socket.io/socket.io.js'], function()
	{	
		/* Now that Socket.IO is loaded we can run Socketbug */
		require({ baseUrl: sb_base }, ['lib/socketbug_application'], function (){});	
	});
};