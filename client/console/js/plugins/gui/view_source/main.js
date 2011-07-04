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

(function ()
{
	var sb_plugin;

	/* Prepare Plugin */
    define(

		sb_plugin =
		{
			init: function ()
			{
	            /* Configure and Capture Click Event to Close Source Code Window */
				jQuery('#close_source').button({ icons: { primary: "ui-icon-circle-close" }, text: false }).click(function(){ 
		
					jQuery('#source_code').slideUp(); 
					jQuery('#settings').slideDown();
				});
	        }
	    }
	);
	
	/* Initialize Plugin */
	sb_plugin.init();
	
}());