'use strict';

var moment = require( 'moment' );

module.exports = function ( request, reply ) {

	var flowdockRequestData = {
		'method' : 'POST',
		'path' : '/messages',
		'body' : {
			'event' : 'message',
			'content' : [
										':::' + request.payload.topic + ':::\n',
										'@team',
										moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
										'created thread for repo:',
										request.params.repo,
										'PR[',
										request.params.issue,
										'](https://github.com/School-Improvement-Network/'+ request.params.repo + '/pull/' + request.params.issue + ')'
									].join( ' ' )
		}
	};

	request.server.methods.flowdock.request( request, flowdockRequestData, function ( flowdockError, flowdockResponse, flowdockBody ) {

		if ( flowdockError ) {
			return reply( flowdockError ).code( 400 );
		}

		var requestData = {
			'method' : 'POST',
			'path' : [ '/repos',
								'School-Improvement-Network',
								request.params.repo,
								'issues',
								request.params.issue,
								'comments' ].join( '/' ),
			'body' : {
				'body' : [ '[THREAD:',
									flowdockBody[ 'thread_id' ],
									']\n Open thread: [' + request.payload.topic + '](https://www.flowdock.com/app/school-improvement-network/chix-chips/threads/',
									flowdockBody[ 'thread_id' ],
									')' ].join( '' )
			}
		};

		request.server.methods.github.request( request, requestData, function ( error, response, body ) {

			if ( error ) {
				return reply( error ).code( 400 );
			}
			return reply( flowdockBody );

		} );

	} );

};
