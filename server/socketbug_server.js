if(typeof(socketbug) === 'undefined')
{
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
	 *
	 * @namespace Socketbug Server 
	 */
	socketbug = function()
	{
		/**
		 * Socketbug Configuration
		 * 
		 * @type Object
		 * 	 
		 * @example <b>_socketbug._config._server_port</b> ( Number ): <b>8080</b>
		 * 
		 * This is your Socketbugs Server Port Number Where Socket.IO is Running
		 * 
		 * @example <b>_socketbug._config._authorized_only._groups</b> ( Boolean ): <b>true</b>
		 * 
		 * Should Group Authentication Be Required? If this is set to true 
		 * then all connections will have their Group ID authenticated on 
		 * whatever server you specify below
		 * 
		 * @example <b>_socketbug._config._authorized_only._applications</b> ( Boolean ): <b>true</b>
		 * 
		 * Should Application Authentication Be Required? If this is set to 
		 * true then all connections will have their Application ID 
		 * authenticated on whatever server you specify below
		 * 
		 * @example <b>_socketbug._config._authorize._host</b> ( String ): <b>www.mywebsite.com</b>
		 * 
		 * Host URL ( NOTE: do not add http:// or a trailing / ) to 
		 * Authentication  Script. This can be any server.  It does not 
		 * have to be on the same  server that Socketbug is installed on.
		 * 
		 * @example <b>_socketbug._config._authorize._port</b> ( Number ): <b>80</b>
		 * 
		 * Port Number for your Authentication Script
		 * 
		 * @example <b>_socketbug._config._authorize._path</b> ( String ): <b>/path/to/my/auth.script</b>
		 * 
		 * Path from root of Authentication Script. Basically, this 
		 * gets appended to _socketbug._config._authorize._host to 
		 * make a complete URL. ( NOTE: This should start with a / )
		 * 
		 * @example <b>_socketbug._config._encryption_salt</b> ( String ): <b>Go0dp4$sW0rd</b>
		 * 
		 * SALT you would like to use for MD5 Hashing.  This is the SAME SALT 
		 * you will use throughout your Socketbug Communications.
		 * 
		 * @example <b>_socketbug._groups</b> ( Object )
		 * 
		 * Object to Store Socketbug Groups.  You will not need to 
		 * mess with this, it's just for storing connection 
		 * info on Socketbug.
		 * 
		 * @example <b>_socketbug._applications</b> ( Object )
		 * 
		 * Object to Store Socketbug Applications.  You will not 
		 * need to mess with this, it's just for storing connection 
		 * info on Socketbug.
		 * 
		 * @example <b>_socketbug._clients</b> ( Object )
		 * 
		 * Object to Store Socketbug Clients.  You will not need 
		 * to mess with this, it's just for storing connection 
		 * info on Socketbug.
		 */
		var _socketbug = 
		{
			'_config': 
			{
				'_server_port': 8080,
				'_authorized_only': 
				{
					'_groups': true,
					'_applications': true
				},
				'_authorize': 
				{
					'_host': 'localhost',
					'_port': 80,
					'_path': '/socketbug/client/example/auth/validate.php'
				},
				'_encryption_salt': 'Ch4ng3^M3'
			},
			'_groups': {},
			'_applications': {},
			'_clients': {}
		};

		/* ================================================== */
		/*   Should Not Need to Change Anything Below Here    */
		/* ================================================== */

		/** Basic Functionality to Manage GUID's */
		var GUID={is_valid:function(value){if(typeof(value)=='undefined'){return false;}if(value.length!==36){return false;}rGx=new RegExp("\\b(?:[A-F0-9]{8})(?:-[A-F0-9]{4}){3}-(?:[A-F0-9]{12})\\b");return (rGx.exec(value)!=null);},create:function(){if(arguments.length==1&&this.is_valid(arguments[0])){value=arguments[0];return value;}var res=[];var hv;var rgx=new RegExp("[2345]");for(var i=0;i<8;i++){hv=(((1+Math.random())*0x10000)|0).toString(16).substring(1);if(rgx.exec(i.toString())!=null){if(i==3){hv="6"+hv.substr(1,3);}res.push("-");}res.push(hv.toUpperCase());}value=res.join('');return value;}};

		/** Node.js Requirements */
		var http = require('http'),
		    crypto = require('crypto');

		/** Setup Socket.io to Listen to Server */
		var io = require('socket.io').listen(_socketbug._config._server_port);

		/** Configure Socket.IO */
		io.configure('production', function () {
			io.set('log level', 1);
		});
		io.configure('development', function () {
			io.set('log level', 3);
		});
		io.configure(function () {
			io.set('log level', 2);
		});

		/** Build a Socket to Isolate the Application Layer */
		var sb_manager = io
			.of('/sb_manager')
			.on('connection', function (socket)
			{
				/** 
				* @function disconnect
				* 
				* Do some House Keeping to Clean Up Stored Data
				*/
				socket.on('disconnect', function ()
				{
					/** Manage Groups on Client Disconnect */
					if(_socketbug._groups)
					{
						try
						{
							/** Determine Group Client belongs to */
							var my_group = _socketbug._clients[socket.id].group.id;
				
							/** Keep track of Clients in the Group */
							var group_clients = 0;
					
							/** Check if Client Group Exists on Socketbug */
							if(typeof(_socketbug._applications[my_application]) != 'undefined')
							{				
								/** Loop through Group Clients and remove Disconnecting Client */
								for(var i=0; i<_socketbug._groups[my_group].clients.length; i++)
								{
									/** This is the Client that's Disconnecting */
									if(_socketbug._groups[my_group].clients[i] == socket.id)
									{
										/** Remove this Client from the Group */
										_socketbug._groups[my_group].clients.splice(i, 1);
									}
									/** There are other Clients in the Group */
									else
									{
										group_clients++;
									}
								}
				
								/** Delete the Group if all Connected Clients from Socketbug are Gone */
								if(group_clients == 0)
								{
									delete _socketbug._groups[my_group];
								}
							}
						}
						catch(error)
						{
							console.error(error);
						}
					}
			
					/** Manage Applications on Client Disconnect */
					if(_socketbug._applications)
					{
						try
						{
							/** Determine Application Client belongs to */
							var my_application = _socketbug._clients[socket.id].application.id;
				
							/** Keep track of Clients in the Application */
							var application_clients = 0;
					
							/** Check if Client Application Exists on Socketbug */
							if(typeof(_socketbug._applications[my_application]) != 'undefined')
							{
								/** Loop through Application Clients and remove Disconnecting Client */
								for(var i=0; i<_socketbug._applications[my_application].clients.length; i++)
								{
									/** This is the Client that's Disconnecting */
									if(_socketbug._applications[my_application].clients[i] == socket.id)
									{
										/** Remove this Client from the Application */
										_socketbug._applications[my_application].clients.splice(i, 1);
									}
									/** There are other Clients in the Application */
									else
									{
										application_clients++;
									}
								}
				
								/** Delete the Application if all Connected Clients from Socketbug are Gone */
								if(application_clients == 0)
								{
									delete _socketbug._applications[my_application];
								}
							}
						}
						catch(error)
						{
							console.error(error);
						}
					}
			
					/** Manage Clients on Disconnect */
					if(_socketbug._clients)
					{
						try
						{
							delete _socketbug._clients[socket.id];
						}
						catch(error)
						{
							console.error(error);
						}
					}
				});
		
				/** 
				* @function connection_manager
				* 
				* Manage Group Connections
				* 
				* @param {Object} group Group Data
				* @param {Object} application Application Data
				* @param {Object} client Client Data
				* @param {Function} callback Callback Handler
				*/
				socket.on('connection_manager', function (group, application, client, callback)
				{	
					var check_auth = false;
			
					/* Add Client to Client List */
					_socketbug._clients[socket.id] = { 
						'client': {
							'id': socket.id,
							'name': ''
						},
						'group': group, 
						'application': application,
						'authenticated': {
							'group': null,
							'application': null,
						}
					};
			
					/** Check if this Group is Already Connected to Socketbug */
					if (_socketbug._groups[group.id])
					{
						sb_manager.socket(socket.id).emit('manager_response', 'Group Already Connected and Approved for Socketbug Use', 'log');
					}
					else if(_socketbug._config._authorized_only._groups)
					{
						sb_manager.socket(socket.id).emit('manager_response', 'Socketbug Server Group Authorization Required', 'warn');
						check_auth = true;
					}
			
					/** Check if this Application is Already Connected to Socketbug */
					if (_socketbug._applications[application.id])
					{
						sb_manager.socket(socket.id).emit('manager_response', 'Application Already Connected and Approved for Socketbug Use');
					}
					else if(_socketbug._config._authorized_only._applications)
					{
						sb_manager.socket(socket.id).emit('manager_response', 'Socketbug Server Application Authorization Required', 'warn');
						check_auth = true;
					}
			
					if(check_auth)
					{
						sb_manager.socket(socket.id).emit('manager_response', 'Checking Authorization...', 'info');
				
						var path = _socketbug._config._authorize._path + '?cb=';
						path += (_socketbug._config._authorized_only._groups) ? '&group_id='+group.id:'';
						path += (_socketbug._config._authorized_only._applications) ? '&application_id='+application.id:'';
					
						/** Setup Options for Socketbug Authorization for Group ID's */
						var options = 
						{
					  		host: _socketbug._config._authorize._host,
					  		port: _socketbug._config._authorize._port,
					  		path: path
						};
		
						/** Establish Connection and Make request */
						http.get(options, function(response)
						{
					        /** Create Variable to Store Returned JSON */
							var data = '';
				
							/** Build the Response in Pieces Should the JSON be Large */
					        response.on('data', function(chunk)
							{
					            data += chunk;
					        });
		
							/** Start Validation now that JSON is done Loading */
					        response.on('end', function()
							{
								try
								{
									/** Build Expected Response */
									var _expected = (_socketbug._config._authorized_only._groups) ? crypto.createHash('md5').update(_socketbug._config._encryption_salt + 'Valid Group ID: ' + group.id).digest("hex") : '';
									_expected += (_socketbug._config._authorized_only._applications) ? crypto.createHash('md5').update(_socketbug._config._encryption_salt + 'Valid Application ID: ' + application.id).digest("hex") : '';
					
									/** Convert JSON String to Javascript Object */
									var json = JSON.parse(data);
					
									/** Verify that the JSON Response Matched Exactly what was Expected */
									if(json.response === _expected)
									{
										authorize_group(socket, group);
										authorize_application(socket, application);
									}
									/** JSON Resonse Did NOT Match */
									else
									{
										if(_socketbug._config._authorized_only._groups && json.group.valid)
										{
											authorize_group(socket, group);
										}
										else
										{
											/** Add this Group to the Unauthorized Group List */
											_socketbug._clients[socket.id].authenticated.group = false;
							
											/** Communicate Unsuccesful Connection */
											sb_manager.socket(socket.id).emit('manager_response', 'Group NOT Approved for Socketbug Use', 'error');
										}
								
										if(_socketbug._config._authorized_only._applications && json.application.valid)
										{
											authorize_application(socket, application);
										}
										else
										{
											/** Add this Group to the Unauthorized Group List */
											_socketbug._clients[socket.id].authenticated.application = false;
							
											/* Communicate Unsuccesful Connection */
											sb_manager.socket(socket.id).emit('manager_response', 'Application NOT Approved for Socketbug Use', 'error');
										}
									}
							
									/** Send Authentication Failures */
									authorization(socket.id);
								}
								catch(message)
								{
									/** Communicate Unsuccesful Connection */
									//socket.emit('manager_response', message, 'error');
								}
							});
					    });
					}
					else
					{
						authorize_group(socket, group);
						authorize_application(socket, application);
					}
			
					/** Execute Callback Handler */
					if(typeof(callback) == 'function')
					{
						callback(socket.id);
					}
			
				});
			}
		);

		/** Build a Socket to Isolate the Application Layer */
		var sb_application = io
			.of('/sb_application')
			.on('connection', function (socket)
			{
				/** 
				* @function execute_js
				* 
				* Capture Console's Remote Javascript Exection Request
				* 
				* @param {String} javascript Javascript to Execute
				* @param {Function} callback Callback Handler
				*/
				socket.on('execute_js', function (javascript, callback)
				{
					try
					{
						/** Fetch Clients Application ID */
						var my_application = _socketbug._clients[socket.id].application.id;
			
						/** Loop through Clients in Matching Application to Send Debug Message */
						for(var i=0; i<_socketbug._applications[my_application].clients.length; i++)
						{
							/** Fetch Client ID for Other Connected Users */
							var app_client = _socketbug._applications[my_application].clients[i];
					
							/** See if Client is Authorized */
							if(authorization(app_client))
							{
								/** Send to Specific Client */
								sb_application.socket(app_client).emit('execute_js', javascript);
						
								/** Execute Callback Handler */
								if(typeof(callback) == 'function')
								{
									callback();
								}
							}
						}
					}
					catch(error)
					{
						console.error(error);
					}
				});
		
				/** 
				* @function view_source
				* 
				* Capture Applications Remote View Source Response
				* 
				* @param {Function} callback Callback Handler
				*/
				socket.on('view_source', function (callback)
				{
					try
					{
						/** Fetch Clients Application ID */
						var my_application = _socketbug._clients[socket.id].application.id;
			
						/** Loop through Clients in Matching Application to Send Debug Message */
						for(var i=0; i<_socketbug._applications[my_application].clients.length; i++)
						{
							/** Fetch Client ID for Other Connected Users */
							var app_client = _socketbug._applications[my_application].clients[i];
							
							/** See if Client is Authorized */
							if(authorization(app_client) && app_client != socket.id)
							{
								/** Send to Specific Client */
								sb_application.socket(app_client).emit('fetch_source');
						
								/** Execute Callback Handler */
								if(typeof(callback) == 'function')
								{
									callback();
								}
							}
						}
					}
					catch(error)
					{
						console.error(error);
					}
				});
			}
		);

		/** Build a Socket to Isolate the Application Layer */
		var sb_console = io
			.of('/sb_console')
			.on('connection', function (socket)
			{
				/** 
				* @function debug
				* 
				* Capture Client Message Event
				* 
				* @param {String} level Debug Level
				* @param {Object} data Data to Debug
				* @param {Function} callback Callback Handler
				*/
				socket.on('debug', function (level, data, callback)
				{
					try
					{
						/** Fetch Clients Application ID */
						var my_application = _socketbug._clients[socket.id].application.id;
			
						/** Loop through Clients in Matching Application to Send Debug Message */
						for(var i=0; i<_socketbug._applications[my_application].clients.length; i++)
						{
							/** Fetch Client ID for Other Connected Users */
							var app_client = _socketbug._applications[my_application].clients[i];
					
							/** See if Client is Authorized */
							if(authorization(app_client))
							{
								/** Send to Specific Client */
								sb_console.socket(app_client).emit('application_debug', level, data[0]);
						
								/** Execute Callback Handler */
								if(typeof(callback) == 'function')
								{
									callback();
								}
							}
						}
					}
					catch(error)
					{
						console.error('Error Authenticating Remote Debug Message');
						console.error(error);
					}
				});
		
				/** 
				* @function view_source
				* 
				* Capture Console's Remote View Source Request 
				* 
				* @param {String} source_code
				*/
				socket.on('view_source', function (source_code)
				{
					try
					{
						/** Fetch Clients Application ID */
						var my_application = _socketbug._clients[socket.id].application.id;
						
						/** Loop through Clients in Matching Application to Send Debug Message */
						for(var i=0; i<_socketbug._applications[my_application].clients.length; i++)
						{
							/** Fetch Client ID for Other Connected Users */
							var app_client = _socketbug._applications[my_application].clients[i];
					
							/** See if Client is Authorized */
							if(authorization(app_client) && app_client != socket.id)
							{
								/** Send to Specific Client */
								sb_console.socket(app_client).emit('view_source', source_code);
							}
						}
					}
					catch(error)
					{
						console.error(error);
					}
				});
			}
		);
	
		/**
		 * Check Authorization of Session ID
		 * 
		 * @param {String} session_id This is the Socket.IO Session ID for Socketbug
		 * 
		 * @return Boolean
		 */ 
		function authorization(session_id)
		{
			/** Check if Either Group or Application Authentication is False.  It is NULL by default and will only be FALSE if authentication failed. */
			if(_socketbug._clients[session_id].authenticated.application !== false && _socketbug._clients[session_id].authenticated.group !== false)
			{
				return true;
			}
			/** Authorization Failed */
			else
			{
				sb_manager.socket(session_id).emit('authentication_failed', _socketbug._clients[session_id].authenticated.application, _socketbug._clients[session_id].authenticated.group);
		
				return false;
			}
		}
	
		/**
		 * Check Authorization of Group ID
		 * 
		 * @param {Object} socket This is the Socket used by Socketbug
		 * @param {String} group This is the Group ID for Socketbug
		 */
		function authorize_group(socket, group)
		{
			/** Set Flag to Indicate if Group is Connected on Socketbug */
			var group_found = false;
	
			/** Loop through Connected Groups */
			for(var group_id in _socketbug._groups)
			{
				if(group_id == group.id)
				{
					group_found = true;
				}
		  	}

			/** This is a New Group */
			if( !group_found)
			{
				_socketbug._groups[group.id] = { 
			
					/** Add Group Data */
					'data': { 
						'id': group.id, 
						'name': group.name 
					}, 
			
					/** Add Client to Group */
					'clients': [socket.id] 
				};
			}
			/** Add New Client to Existing Group */
			else
			{	
				_socketbug._groups[group.id].clients.push(socket.id);
			}
	
			/** Tell Socketbug that Client can Communicate with Group */
			_socketbug._clients[socket.id].authenticated.group = true;
	
			sb_manager.socket(socket.id).emit('manager_response', 'Group Authorized for Socketbug Use', 'info');
		}
	
		/**
		 * Check Authorization of Application ID
		 * 
		 * @param {Object} socket This is the Socket used by Socketbug
		 * @param {String} application This is the Application ID for Socketbug
		 */
		function authorize_application(socket, application)
		{
			/** Set Flag to Indicate if Application is Connected on Socketbug */
			var application_found = false;
	
			/** Loop through Connected Applications */
			for(var application_id in _socketbug._applications)
			{
				if(application_id == application.id)
				{
					application_found = true;
				}
		  	}

			/** This is a New Application */
			if( !application_found)
			{
				_socketbug._applications[application.id] = { 
			
					/** Add Application Data */
					'data': { 
						'id': application.id, 
						'name': application.name 
					}, 
			
					/** Add Client to Application */
					'clients': [socket.id] 
				};
			}
			/** Add New Client to Existing Application */
			else
			{	
				_socketbug._applications[application.id].clients.push(socket.id);
			}
	
			/** Tell Socketbug that Client can Communicate with Application */
			_socketbug._clients[socket.id].authenticated.application = true;
	
			sb_manager.socket(socket.id).emit('manager_response', 'Application Authorized for Socketbug Use', 'info');
		}
	}();
}