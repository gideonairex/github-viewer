'use strict';

module.exports = function ( request, reply ) {

	var requestData = {
		'method' : 'GET',
		// Find another way to check the token
		'path' : [ '/repos', 'School-Improvement-Network', 'observation-gateways', 'pulls' ].join( '/' )
	};

	request.server.methods.github.request( request, requestData, function ( error, response, body ) {

		if ( error || body.message === 'Bad credentials' ) {
			return reply.redirect( '/' );
		}

		var cookie = {
			'username'    : request.payload.username,
			'accessToken' : request.payload[ 'access-token' ]
		};

		var flowdockCookie = {
			'username'    : request.payload.username,
			'accessToken' : request.payload[ 'flowdock-access-token' ]
		};

		reply
			.redirect( '/home' )
			.state( 'github', cookie )
			.state( 'flowdock', flowdockCookie );

	} );

};
