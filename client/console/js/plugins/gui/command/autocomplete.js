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

	/**
	 * List of Command we want in our Auto Complete List
	 * You can manually add whatever you wish here.
	 * Commands you type will be added to this list ( if not already in it )
	 * but will be reset when the page refreshes.
	 */
	var recent_commands = [
		"alert('');",
		"$('')",
		"$('').addClass('');",
		"$('').after('');",
		"$('').append('');",
		"$('').appendTo('');",
		"$('').attr('');",
		"$('').before('');",
		"$('').change();",
		"$('').click();",
		"$('').clone('');",
		"$('').css('', '');",
		"$('').dblclick();",
		"$('').detach('');",
		"$('').empty();",
		"$('').fadeIn();",
		"$('').fadeOut();",
		"$('').fadeTo('slow', 0.5);",
		"$('').fadeToggle();",
		"$('').height();",
		"$('').hide();",
		"$('').html('');",
		"$('').innerHeight();",
		"$('').innerWidth();",
		"$('').insertAfter('');",
		"$('').insertBefore('');",
		"$('').offset();",
		"$('').outerHeight();",
		"$('').outerWidth();",
		"$('').position();",
		"$('').prepend('');",
		"$('').prependTo('');",
		"$('').prop('');",
		"$('').remove();",
		"$('').removeAttr('');",
		"$('').removeClass('');",
		"$('').removeProp();",
		"$('').replaceAll('');",
		"$('').replaceWith('');",
		"$('').scrollLeft();",
		"$('').scrollTop();",
		"$('').serialize();",
		"$('').serializeArray();",
		"$('').show();",
		"$('').size();",
		"$('').slideDown();",
		"$('').slideToggle();",
		"$('').slideUp();",
		"$('').stop();",
		"$('').submit();",
		"$('').text('');",
		"$('').toArray();",
		"$('').toggle();",
		"$('').toggleClass('');",
		"$('').trigger('');",
		"$('').unwrap();",
		"$('').val('');",
		"$('').width();",
		"$('').wrap('');",
		"$('').wrapAll('');",
		"$('').wrapInner('');"
	];
	
	/* Prepare Plugin */
    define(

		sb_plugin =
		{
			init: function ()
			{
	            /* Add jQuery UI Autocomplete to Command */
				jQuery("#command").autocomplete({
					source: recent_commands,
					minLength: 0,
					position: 
					{ 
						my : "left bottom", 
						at: "left top"
					}
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
							/* Check if this Command was in the Command List */
							var command = jQuery('#command').val();
							if(jQuery.inArray(command, recent_commands) == -1)
							{
								/* Command was not in the list, so add it */
								recent_commands.push(jQuery('#command').val());
				
								/* Reset Auto Complete */
								$("#command").autocomplete({
									source: recent_commands
								});
							}
						}
					}
				});
	        }
	    }
	);
	
	/* Initialize Plugin */
	sb_plugin.init();
	
}());