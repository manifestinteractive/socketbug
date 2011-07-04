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
	            /* Setup Buttons to Receive jQuery UI Style */
				jQuery("button").button();
	
				/* Turn Command List into Combo Box */
				jQuery('#command_list').combobox();
	
				/* Capture Click Event to Toggle Settings Window */
				jQuery('#settings_tab a').click(function()
				{
					jQuery('#settings').slideToggle();
				});
	
				/* Capture Click Event to Run Selected Command */
				jQuery('#run_command').click(function(){

					/* Check which Command to Run */
					switch(jQuery('select#command_list').val())
					{
						/* Run View Source Command */
						case 'view_source':
				
							/* Remove old Pre Tag to Prevent Issues */
							jQuery('#source_code pre').remove();
				
							/* Hide old Source Code Window */
							jQuery('#source_code').slideUp();
				
							/* Fetch Remote Application Source Code */
							socketbug.view_source();
				
							break;
				
						case 'setup_create_guid':
				
							socketbug.log('New GUID:&nbsp; <span class="value">'  + GUID.create() + '</span>', 'info', 'console');
			
							break;
				
						case 'setup_validate_app_guid':
				
							var is_valid = (GUID.is_valid(_sbs.application_id)) ? 'VALID':'INVALID';
				
							socketbug.log('Your Application GUID format is:&nbsp; <span class="value">'  + is_valid + '</span>', 'info', 'console');
			
							break;
				
						case 'setup_validate_group_guid':
			
				
							var is_valid = (GUID.is_valid(_sbs.group_id)) ? 'VALID':'INVALID';
				
							socketbug.log('Your Group GUID format is:&nbsp; <span class="value">'  + is_valid + '</span>', 'info', 'console');
			
							break;
					}
		
					/* Reset Command List */
					jQuery('#command_list').val("list");
					jQuery('.combobox_label').val(jQuery('#command_list option:selected').text());
				
				});
	        }
	    }
	);
	
	/* Initialize Plugin */
	sb_plugin.init();
	
}());