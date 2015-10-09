'use strict';

var Request = require( 'request' );

module.exports = function ( request, requestData, next ) {

	var payload = request.payload;

	var accessToken = ( payload && payload[ 'flowdock-access-token' ] ) || request.state.flowdock.accessToken;

	// Transfer to config
	var flowDockURI = 'https://' + accessToken + '@api.flowdock.com/flows/school-improvement-network/chix-chips';

	var options = {
		'method' : requestData.method,
		'url'    : requestData.absUrl || [ flowDockURI, requestData.path ].join( '' )
	};

	if ( requestData.method.toLowerCase() === 'post' ) {
		options.body = requestData.body;
		options.json = true;
	}

	return Request( options, function ( error, response, body ) {
		return next( error, response, body );
	} );

};
