<?PHP
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
 * @todo: This is a not intended for Real Authorization.
 *        This just shows how we will be testing on the
 *        Server for a Response.  You can write whatever
 *        code you see fit.  Probably something connected
 *        to a database or something ;)
 */

error_reporting(0);

/* Same Salt as used in Socketbug Server */
define('ENCRYPTION_SALT', 'Ch4ng3^M3');

/**
 * This is an example of fetching keys we may need for authentication
 * Socketbug is Sending over the GUID's as a Salted MD5 Hash
 * 
 * @example md5( ENCRYPTION_SALT . '4704808A-80A9-6DD3-341F-E18A3F00563A' )
 * 
 * The following are just random GUID's we created.
 */
$groups = array(
	md5(ENCRYPTION_SALT . '4704808A-80A9-6DD3-341F-E18A3F00563A'),
	md5(ENCRYPTION_SALT . '4F9796F7-0834-627D-C9E5-27B61B8A0201'),
	md5(ENCRYPTION_SALT . 'BDE1EE2B-4ABF-6EB1-D0C3-A97F6ADAD307'),
	md5(ENCRYPTION_SALT . '0F90BC71-E320-626C-4E6B-AC7CAB180E24'),
	md5(ENCRYPTION_SALT . '7CF7645D-C0A3-6B78-80E2-8186C8AA36CA'),
	md5(ENCRYPTION_SALT . '29D31E86-FC8E-6775-ED74-F0FDADB7B800'),
	md5(ENCRYPTION_SALT . '21190716-5AB2-6701-7292-4EF603878EEA'),
	md5(ENCRYPTION_SALT . 'B14A9DD2-3F24-6ECB-54E1-A7CF73C85BB1'),
	md5(ENCRYPTION_SALT . '02C9BB6D-3147-6FD9-2BCD-983A287F61F6'),
	md5(ENCRYPTION_SALT . 'C19EA93E-B7A6-628E-E3D7-6DA6D99C3ED6')
);

$applications = array(
	md5(ENCRYPTION_SALT . '5E3E8FB6-86CF-6BF8-B4C4-6B2497BC388C'),
	md5(ENCRYPTION_SALT . '4F9796F7-0834-627D-C9E5-27B61B8A0201'),
	md5(ENCRYPTION_SALT . 'BDE1EE2B-4ABF-6EB1-D0C3-A97F6ADAD307'),
	md5(ENCRYPTION_SALT . '0F90BC71-E320-626C-4E6B-AC7CAB180E24'),
	md5(ENCRYPTION_SALT . '7CF7645D-C0A3-6B78-80E2-8186C8AA36CA'),
	md5(ENCRYPTION_SALT . '29D31E86-FC8E-6775-ED74-F0FDADB7B800'),
	md5(ENCRYPTION_SALT . '21190716-5AB2-6701-7292-4EF603878EEA'),
	md5(ENCRYPTION_SALT . 'B14A9DD2-3F24-6ECB-54E1-A7CF73C85BB1'),
	md5(ENCRYPTION_SALT . '02C9BB6D-3147-6FD9-2BCD-983A287F61F6'),
	md5(ENCRYPTION_SALT . 'C19EA93E-B7A6-628E-E3D7-6DA6D99C3ED6')
);

/**
 * Here we will fetch the GET variable set over from the JSON request
 * and do a little house cleaning to make them identical to what
 * Socketbug is expecting as a return.  Also stripping out any
 * characters we know should not be there for good measure.
 */

/* Get the Group ID from the URL */
$group_id = ereg_replace('[^a-z0-9]', '', $_GET['group_id']);

/* Get the Application ID from the URL */
$application_id = ereg_replace('[^a-z0-9]', '', $_GET['application_id']);

/**
 * Now we need to verify that the GUID's that were passed over exist.
 * Then make a return Salted MD5 Hash of a custom string to send back
 * to Socketbug as proof of our success.  Socket bug will be taking 
 * the exact same string and rebuilding it to make sure we have a match.
 */

/* Prepare Response */
$return = array();
$return['response'] = '';

/* Validate Group ID */
if( !empty($group_id))
{
	/**
	 * Prepare a Group Validation String for Socketbug
	 * 
	 * Socketbug is expecting the Verified Salted MD5 Hash for this Group ID to be:
	 *
	 * @example md5( ENCRYPTION_SALT . 'Valid Group ID: ' . $group_id ) 
	 */
	$valid_group = (in_array($group_id, $groups)) 
		? 'Valid Group ID: '.$group_id
		: 'Invalid Group ID: '.$group_id;
		
	/* Return Group Validation Information */
	$return['group'] = array(
		'valid' => in_array($group_id, $groups),
		'group_id' => $group_id,
	);
	
	/* Append Validation String to Response */
	$return['response'] .= md5(ENCRYPTION_SALT . $valid_group);
}

/* Validate Application ID */
if( !empty($application_id))
{
	/**
	 * Prepare an Application Validation String for Socketbug
	 * 
	 * Socketbug is expecting the Verified Salted MD5 Hash for this Application ID to be:
	 *
	 * @example md5( ENCRYPTION_SALT . 'Valid Application ID: ' . $application_id ) 
	 */
	$valid_application = (in_array($application_id, $applications)) 
		? 'Valid Application ID: '.$application_id
		: 'Invalid Application ID: '.$application_id;
		
	/* Return Application Validation Information */
	$return['application'] = array(
		'valid' => in_array($application_id, $applications),
		'application_id' => $application_id,
	);
	
	/* Append Validation String to Response */
	$return['response'] .= md5(ENCRYPTION_SALT . $valid_application);
}

/* Return JSON */
echo json_encode($return);
?>