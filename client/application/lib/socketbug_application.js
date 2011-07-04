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

if(typeof(socketbug) === 'undefined')
{	
	/**
	 * @private
	 */
	var _encryption_salt = 'Ch4ng3^M3';
	
	/**
	 * @namespace Socketbug Console 
	 */
	var socketbug = {

		/** 
		 * Check if we're connected to Socketbug 
		 * 
		 * @param {Boolean} connected
		 */
		connected: false,
		
		/**
		 * Store Socketbug Session ID 
		 * 
		 * @param {String} session_id
		 */
		session_id: null,
		
		/** 
		 * Define Group Data 
		 * 
		 * @param {Object} group
		 */
		group:
		{
			'id': hex_md5(_encryption_salt + _sbs.group_id),
			'name': _sbs.group_name
		}, 
		
		/** 
		 * Define Application Data 
		 * 
		 * @param {Object} application
		 */
		application:
		{
			'id': hex_md5(_encryption_salt + _sbs.application_id),
			'name': _sbs.application_name
		}, 
		
		/** 
		 * Define Client Data 
		 * 
		 * @param {Object} client
		 */
		client:
		{
			'id': hex_md5(_encryption_salt + GUID.create()),
			'name': ''
		}, 
		
		/** 
		 * Debug Level
		 * 
		 * @example 5 = log, debug, info, warn, & error
		 * @example 4 = debug, info, warn, & error
		 * @example 3 = info, warn, & error
		 * @example 2 = warn, & error
		 * @example 1 = error
		 * @example 0 = disable all debug messages
		 * 
		 * @param {Number} debug_level This is set in the HTML Configuration
		 */
		debug_level: _sbs.debug_level,
		
		/** Socketbug Server Comminication */
		sb_manager: io.connect(_sbs.host + ':' + _sbs.port + '/sb_manager'),
		
		/** Socketbug Appliction Comminication */
		sb_application: io.connect(_sbs.host + ':' + _sbs.port + '/sb_application'),
		
		/** Socketbug Console Comminication */
		sb_console: io.connect(_sbs.host + ':' + _sbs.port + '/sb_console'),
		
		/** 
		 * Setup Ouput Log for Console 
		 * 
		 * @function
		 * @param {String} message This is the message to Log
		 * @param {String} level The is the Debug Level
		 */
		log: function(message, level)
		{
			/**
			 * Using CONSOLE here and NOT DEBUG to prevent looping back 
			 * to Socketbug since DEBUG has a callback handler 
			 * to return data to Socketbug 
			 */
			switch(level)
			{
				case 'log':
					if(_sbs.debug_level == 5)
					{
						console.log(message);
					}
					break;
					
				case 'debug':
					if(_sbs.debug_level >= 4)
					{
						console.debug(message);
					}
					break;
					
				case 'info':
					if(_sbs.debug_level >= 3)
					{
						console.info(message);
					}
					break;
				
				case 'warn':
					if(_sbs.debug_level >= 2)
					{
						console.warn(message);
					}
					break;
					
				case 'error':
					if(_sbs.debug_level >= 1)
					{
						console.error(message);
					}
					break;
			}			
		},
		
		/** 
		 * Capture All Debug Events and send them through Socketbug
		 * 
		 * @function
		 * @param {String} level The is the Debug Level
		 */
		debug: function(level)
		{
			var args = Array.prototype.slice.call(arguments, 1);
		
			socketbug.sb_console.emit('debug', level, args, 
				function()
				{
					socketbug.log('Sent Debug info to Remote Console.', 'log');
				}
			);			
		}
	};
	
	/* ================================================== */
	/*            Socketbug Socket.IO Manager             */
	/* ================================================== */
	
	/** Capture Connect Event */
	socketbug.sb_manager.on('connect', function()
	{		
		if(socketbug.connected === false)
		{				
			if( !GUID.is_valid(_sbs.group_id))
			{
				socketbug.log('Invalid Socketbug Group ID', 'error');
			}
			else if( !GUID.is_valid(_sbs.application_id))
			{
				socketbug.log('Invalid Socketbug Application ID', 'error');
			}
			else
			{
				var date = new Date();
			
				socketbug.log('Socketbug Connected');
				socketbug.connected = true;
		
				socketbug.sb_manager.emit('connection_manager', socketbug.group, socketbug.application, socketbug.client, 
					function(session_id)
					{ 
						socketbug.log('Connected to Socketbug with Session ID: '+session_id);
						
						socketbug.session_id = session_id;
						
						/* Do Callback if one set */
						if(typeof(_sbs.connect_callback) == 'function')
						{
							_sbs.connect_callback(session_id);
						}  
					}
				);
			}
		}
	});
	
	/** Capture Failed Authentication Event */
	socketbug.sb_manager.on('authentication_failed', function (group_valid, application_valid)
	{		
		if( !group_valid)
		{
			alert('You are Not Authorized to use Socketbug. Your Group ID is Invalid.');
		}
		if( !application_valid)
		{
			alert('You are Not Authorized to use Socketbug. Your Application ID is Invalid.');
		}
		
		/** Disconnect Client from Socketbug Services */
		socketbug.sb_manager.disconnect();
		socketbug.sb_application.disconnect();
		socketbug.sb_console.disconnect();
	});
	
	/** Capture Failed Authentication Event */
	socketbug.sb_application.on('execute_js', function (javascript)
	{		
		try
		{
			/** I know... this is an eval() ... I am pure EVIL() */
			eval(javascript);
		}
		catch(error)
		{
			socketbug.log(error, 'error');
		}
	});
	
	/** Capture Failed Authentication Event */
	socketbug.sb_application.on('fetch_source', function ()
	{		
		try
		{
			/** Fetch Source Code */
			var source_code = document.getElementsByTagName("html")[0].innerHTML;
			
			/** Replace Characters that can cause issues on some browsers */
			source_code = source_code.replace(/</g,'&lt;');
			source_code = source_code.replace(/>/g,'&gt;');
			
			/** Send to Specific Client */
			socketbug.sb_console.emit('view_source', source_code);
			
			socketbug.log('Console Requested Source Code', 'info');
		}
		catch(error)
		{
			socketbug.log(error, 'error');
		}
	});
	
	/** Capture Connect Event */
	socketbug.sb_manager.on('disconnect', function()
	{
		/* Do Callback if one set */
		if(typeof(_sbs.disconnect_callback) === "function")
		{
			_sbs.disconnect_callback();
		}
	});
	
	/** Capture Responses from Socketbug Manager */
	socketbug.sb_manager.on('manager_response', function (message, level)
	{
		socketbug.log(message, level);
	});	
	
	/** Configure Callback Handler to use Socketbug */
	debug.setCallback(socketbug.debug, true);
	
	/** Set Debug Level for Socketbug Console */
	debug.setLevel(socketbug.debug_level);
}