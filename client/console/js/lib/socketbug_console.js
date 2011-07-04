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
		 * @param {String} mode This is the Mode ( application | console )
		 */
		log: function(message, level, mode)
		{
			/* Prepare Variables for the Log */
			var now = new Date();
			var date = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
			var sb_mode = (typeof(mode) == 'undefined') ? 'console':mode;
			var css_class_prefix = (sb_mode == 'console') ? 'con_debug_':'app_debug_';
			
			/* Remove all Recent Classes from Log List */
			jQuery('#output ul li').removeClass('recent');
			
			/* Determine the Log Level so we can Customize it for our Ouput */
			switch(level)
			{
				case 'log':
					if(_sbs.debug_level == 5)
					{
						jQuery('#output ul').prepend('<li class="recent ' + css_class_prefix + level + '" style="display: none;"><span>[ ' + date + ' ]</span> ' + message + '</li>');	
					}
					break;
					
				case 'debug':
					if(_sbs.debug_level >= 4)
					{
						jQuery('#output ul').prepend('<li class="recent ' + css_class_prefix + level + '" style="display: none;"><span>[ ' + date + ' ]</span> ' + message + '</li>');
					}
					break;
					
				case 'info':
					if(_sbs.debug_level >= 3)
					{
						jQuery('#output ul').prepend('<li class="recent ' + css_class_prefix + level + '" style="display: none;"><span>[ ' + date + ' ]</span> ' + message + '</li>');
					}
					break;
				
				case 'warn':
					if(_sbs.debug_level >= 2)
					{
						jQuery('#output ul').prepend('<li class="recent ' + css_class_prefix + level + '" style="display: none;"><span>[ ' + date + ' ]</span> <span class="warn">' + message + '</span></li>');
					}
					break;
					
				case 'error':
					if(_sbs.debug_level >= 1)
					{
						jQuery('#output ul').prepend('<li class="recent ' + css_class_prefix + level + '" style="display: none;"><span>[ ' + date + ' ]</span> <span class="error">' + message + '</span></li>');
					}
					break;
			}
			
			/* Fade in New Log Entry */
			jQuery('.recent').fadeIn();
			
		},
		
		/** 
		 * Send Javascript Command
		 * 
		 * @function
		 * @param {String} javascript Command to Execute
		 */
		js: function(javascript)
		{
			/**
			 * Fun Times for those who viewed this Source Code
			 * Some Magical Word unlocks the Awesomeness ...
			 * Good Luck, and FYI, You Rock! But you already know that ;)
			 */
			if(hex_md5(javascript) == '93bdae2e846d2c226c8c2c201e15ffdb')
			{
				/* Add Custom Class */
				jQuery('#watermark').addClass('its_alive');
				
				/* Set Timeout to Remove Class so we can repeat this later */
				setTimeout(function(){ jQuery('#watermark').removeClass('its_alive'); }, 5100);
				
				socketbug.log('<span class="value">IT\'S ALIVE!!!</span>', 'error', 'console');
				
				jQuery('#command').val('').blur();
				
				/* Exit */
				return true;
			}
			else
			{
				/* Start Loading Animation */
				jQuery('#loading').fadeIn('fast');
			
				/* Send JSON to Socketbug Server */
				socketbug.sb_application.emit('execute_js', javascript, 
					function()
					{ 
						jQuery('#loading').fadeOut('fast'); 
						socketbug.log('Executed Remote Javascript: <span class="value">' + javascript + '</span>', 'info', 'console');
					}
				);
			}
		},
		
		/** 
		 * Get Source Code
		 * 
		 * @function
		 */
		view_source: function()
		{
			/** Start Loading Animation */
			jQuery('#loading').fadeIn('fast');
		
			/** Send JSON to Socketbug Server */
			socketbug.sb_application.emit('view_source', 
				function()
				{ 
					socketbug.log('Fetching Remote Source Code...', 'info', 'console');
				}
			);
		}
	};
	
	/** 
	 * Capture Connecting Event
	 * 
	 * @function
	 * @param {String} transport_type Connecting Transport Type
	 */
	socketbug.sb_manager.on('connecting', function (transport_type)
	{
		socketbug.log('Attempting to connect to Socketbug via ' + transport_type + '...', 'log', 'console');
		socketbug.connected = false;
	});

	/** 
	 * Capture Connect Event
	 * 
	 * @function
	 */
	socketbug.sb_manager.on('connect', function ()
	{
		/* Stop Loading Animation */
		jQuery('#loading').fadeOut('slow');
		
		/* Toggle Connection Indicator to ON Position */
		jQuery('#connect').attr('checked', true).trigger('change');
			
		if(socketbug.connected === false)
		{				
			if( !GUID.is_valid(_sbs.group_id))
			{
				socketbug.log('Invalid Socketbug Group ID', 'error', 'console');
			}
			else if( !GUID.is_valid(_sbs.application_id))
			{
				socketbug.log('Invalid Socketbug Application ID', 'error', 'console');
			}
			else
			{
				var date = new Date();
			
				socketbug.log('Socketbug Connected', 'log', 'console');
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

				/* Do Callback if one set */
				if(typeof(_sbs.connect_callback) === "function")
				{
					_sbs.connect_callback();
				}
			}
		}
	});
	
	/** 
	 * Capture Responses from Socketbug Manager
	 * 
	 * @function
	 * @param {String} message Manager Response Message
	 * @param {String} level Manager Response Level
	 */
	socketbug.sb_manager.on('manager_response', function (message, level)
	{
		socketbug.log(message, level, 'console');
	});	

	/** 
	 * Capture Connect Failed Event
	 * 
	 * @function
	 */
	socketbug.sb_manager.on('connect_failed', function ()
	{
		/* Stop Loading Animation */
		jQuery('#loading').fadeOut('slow');
		
		/* Toggle Connection Indicator to OFF Position */
		jQuery('#connect').attr('checked', false).trigger('change');
		
		socketbug.log('Failed to Connect to Socketbug', 'error', 'console');
		socketbug.connected = false;
		socketbug.disconnect();
		
	});
	
	/** 
	 * Capture Remote Debug Application Message
	 * 
	 * @function
	 * @param {String} level Debug Level
	 * @param {Object} data Debug Data
	 */
	socketbug.sb_console.on('application_debug', function (level, data)
	{
		/* Check the Debug Level */
		switch(level)
		{
			case 'log':
				/* Show Message in Console Ouput Window */
				if(typeof(data) == 'string')
				{
					socketbug.log('<img src="./img/debug_log.png">Remote LOG:&nbsp; <span class="log">' + data + '</span>', 'log', 'application');
				}
				else
				{
					socketbug.log('<img src="./img/debug_log.png">Remote LOG:&nbsp; <span class="log">Remote Data Sent to Browser Console ( could not be displayed here )</span>', 'log', 'application');
					debug.log(data);
				}
				break;

			case 'debug':
				/* Show Message in Console Ouput Window */
				if(typeof(data) == 'string')
				{
					socketbug.log('<img src="./img/debug_debug.png">Remote DEBUG:&nbsp; <span class="debug">' + data + '</span>', 'debug', 'application');
				}
				else
				{
					socketbug.log('<img src="./img/debug_debug.png">Remote DEBUG:&nbsp; <span class="debug">Remote Data Sent to Browser Console ( could not be displayed here )</span>', 'debug', 'application');
					debug.debug(data);
				}
				break;

			case 'info':
				/* Show Message in Console Ouput Window */
				if(typeof(data) == 'string')
				{
					socketbug.log('<img src="./img/debug_info.png">Remote INFO:&nbsp; <span class="info">' + data + '</span>', 'info', 'application');
				}
				else
				{
					socketbug.log('<img src="./img/debug_info.png">Remote INFO:&nbsp; <span class="info">Remote Data Sent to Browser Console ( could not be displayed here )</span>', 'info', 'application');
					debug.info(data);
				}
				break;

			case 'warn':
				/* Show Message in Console Ouput Window */
				if(typeof(data) == 'string')
				{
					socketbug.log('<img src="./img/debug_warn.png">Remote WARN:&nbsp; <span class="warn">' + data + '</span>', 'warn', 'application');
				}
				else
				{
					socketbug.log('<img src="./img/debug_warn.png">Remote WARN:&nbsp; <span class="warn">Remote Data Sent to Browser Console ( could not be displayed here )</span>', 'warn', 'application');
					debug.warn(data);
				}
				break;

			case 'error':
				/* Show Message in Console Ouput Window */
				if(typeof(data) == 'string')
				{
					socketbug.log('<img src="./img/debug_error.png">Remote ERROR:&nbsp; <span class="error">' + data + '</span>', 'error', 'application');
				}
				else
				{
					socketbug.log('<img src="./img/debug_error.png">Remote ERROR:&nbsp; <span class="error">Remote Data Sent to Browser Console ( could not be displayed here )</span>', 'error', 'application');
					debug.error(data);
				}
				break;
		}
	});

	/** 
	 * Capture Failed Authentication Event
	 * 
	 * @function
	 * @param {Boolean} group_valid 
	 * @param {Boolean} application_valid 
	 */
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
		
		/* Disconnect Client from Socketbug Services */
		socketbug.sb_manager.disconnect();
		socketbug.sb_application.disconnect();
		socketbug.sb_console.disconnect();
	});
	
	/** 
	 * Capture Message Event
	 * 
	 * @function
	 * @param {String} src HTML Source Code
	 */
	socketbug.sb_console.on('view_source', function (src)
	{
		socketbug.log('Received Source Code', 'info', 'console');
	
		/* Prepare Syntax Highlighting for Source Code */
		var brush = new SyntaxHighlighter.brushes.Xml(),
		code = src,html;
	
		/* Render Syntax Highligher */
		brush.init(
		{ 
			'toolbar': false,
			'auto-links': true,
			'smart-tabs': true,
			'gutter': true
		});
		html = brush.getHtml(code);
	
		/* Update Interface Elements */
		jQuery('#source_code pre').remove();
		jQuery('#source_code').append('<pre></pre>');
		jQuery('#source_code pre').html(html);
		jQuery('#source_code').slideDown();
		jQuery('#output').slideUp();
		jQuery('#settings').slideUp();
		
		/* Stop Loading Animation */
		jQuery('#loading').fadeOut('slow');
	});

	/** 
	 * Capture Close Event
	 * 
	 * @function
	 */
	socketbug.sb_manager.on('close', function ()
	{
		socketbug.log('Connection to Socketbug Closed', 'warn', 'console');
		socketbug.connected = false;
	});

	/** 
	 * Capture Disconnect Event
	 * 
	 * @function
	 */
	socketbug.sb_manager.on('disconnect', function ()
	{
		/* Toggle Connection Indicator to OFF Position */
		jQuery('#connect').attr('checked', false).trigger('change');
		
		socketbug.log('Socketbug Disconnected', 'warn', 'console');
		socketbug.connected = false;
		
		/* Do Callback if one set */
		if(_sbs.disconnect_callback && typeof(_sbs.disconnect_callback) === "function")
		{
			_sbs.disconnect_callback();
		}
	});

	/** 
	 * Capture Reconnect Event
	 * 
	 * @function
	 * @param {String} transport_type 
	 * @param {Number} reconnectionAttempts 
	 */
	socketbug.sb_manager.on('reconnect', function (transport_type, reconnectionAttempts)
	{
		socketbug.log('Successfully Reconnected to Socketbug via ' + transport_type + ' with Attempt #' + reconnectionAttempts, 'log', 'console');
		socketbug.connected = false;
	});

	/** 
	 * Capture Reconnecting Event
	 * 
	 * @function
	 * @param {Number} reconnectionDelay 
	 * @param {Number} reconnectionAttempts 
	 */
	socketbug.sb_manager.on('reconnecting', function (reconnectionDelay, reconnectionAttempts)
	{
		socketbug.log('Attempt #' + reconnectionAttempts + ' at Reconnecting to Socketbug...', 'warn', 'console');
		socketbug.connected = false;
	});

	/** 
	 * Capture Close Event
	 * 
	 * @function
	 */
	socketbug.sb_manager.on('reconnect_failed', function ()
	{
		socketbug.log('Failed to Reconnect to Socketbug', 'error', 'console');
		socketbug.connected = false;
	});
	
	/** Set Debug Level for Socketbug Console */
	debug.setLevel(socketbug.debug_level);
}