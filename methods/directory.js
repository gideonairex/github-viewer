'use strict';

module.exports = [

	{
		'name'   : 'github.request',
		'method' : require( './handlers/github.request' )
	},

	{
		'name'   : 'flowdock.request',
		'method' : require( './handlers/flowdock.request' )
	}

];
