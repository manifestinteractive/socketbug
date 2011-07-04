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

/**
 * @example http://requirejs.org/docs/plugins.html for details on making plugins
 */

(function ()
{
    /**
 	 * Create a Variable Name for your Plugin. 
	 * It will only be useful for when the plugin loads as it will not be accessible outside this plugin.
	 * But this will, at least, allow you to run an init() function or something
	 * for when the plugin is done loading
	 */
	var plugin;

	/* Setup Some Variables that Cannot be Accessed Directly */
	var random_number = Math.floor(Math.random()*1000),
	    todays_date = new Date();

	/* Setup Some Functions that Cannot be Accessed Directly */
	function private_function (some_variable) 
	{
        /* Private Function has Access to Private Varibles */
		return {
            my_var: some_variable,
            random: random_number,
            date: todays_date
        };
    }
	function another_private_function (foo, bar, baz) 
	{
        /* Private Function has Access to Private Varibles */
		return {
            foo: foo,
            bar: bar,
            baz: baz,
            random: random_number,
            date: todays_date
        };
    }
	
	/* Prepare Plugin */
    define(
		
		/* Update Your Plugin Variable */
		plugin =
		{
	        /* Setup Some Pulic Variables that can be Accessed Directly in any code
			 * 
			 * @example -> require('js/plugins/sample').status;
			 *
			 */
			status: 'Nothing Happening Here...',

			/*
	 		 * This is a Public Plugin Function, you can call it directly in any code
			 * 
			 * @example -> require('js/plugins/sample').public_function('Hello World');
			 *
			 */
			public_function: function (some_variable)
			{
	            this.status = 'Public Function Executed';
			
				return private_function(some_variable);
	        },

			/*
	 		 * This is another Public Plugin Function, you can call it directly in any code
			 * 
			 * @example -> require('js/plugins/sample').another_public_function('sample', 'testing', '123');
			 *
			 */
			another_public_function: function (foo, bar, baz)
			{
	            this.status = 'Another Public Function Executed';

				return another_private_function(foo, bar, baz);
	        },

			/*
	 		 * This is a Public Plugin Function, you can call it directly in any code
			 * 
			 * @example -> require('js/plugins/sample').init();
			 *
			 */
			init: function ()
			{
	            // do something here ...
	        }
	    }
	);
	
	/* Now with the Public Plugin Variable you can auto load a function */
	plugin.init();
	
}());