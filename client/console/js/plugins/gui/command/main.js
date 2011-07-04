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
				/* Capture Triple Click Event to Clear Command Entry */
				jQuery('#command').bind('tripleclick', function(event)
				{
					jQuery('#command').val('');
				});
	
				/* Capture Focus Event to add Command Focus Indicator Graphic */
				jQuery('#command').focus(function(){
					jQuery('#command_line div').addClass('focus');
				});
	
				/* Capture Focus Event to remove Command Focus Indicator Graphic */
				jQuery('#command').blur(function(){
					jQuery('#command_line div').removeClass('focus');
				});
				
				/* Monitor ENTER Key Press on Command Entry */
				jQuery('#command').keypress(function(e)
				{
					code = (e.keyCode ? e.keyCode : e.which);
					if (code == 13)
					{
						/* Make Sure Something was Entered */
						if(jQuery('#command').val() != '')
						{
							/* Send Javascript Command to Socketbug */
							socketbug.js(jQuery('#command').val());
							e.preventDefault();
							
							jQuery('#command').val('');
						}
					}
				});
	        }
	    }
	);
	
	/* Initialize Plugin */
	sb_plugin.init();
	
}());