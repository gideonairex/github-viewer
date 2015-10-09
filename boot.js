'use strict';

var Promise = require( 'bluebird' );
var Hapi    = require( 'hapi' );
var Good    = require( 'good' );

var server = new Hapi.Server();

server.connection( {
	'port' : 5555
} );

var plugins = [

	require( 'inert' ),
	require( 'vision' ),

	{
		'register': Good,
		'options' : {
			'reporters' : [ {
				'reporter' : require( 'good-console' ),
				'events'   : {
					'response' : '*',
					'log'      : '*'
				}

			} ]
		}
	}

];

server.register( plugins, function ( error ) {

	server.state( 'github', {
		'ttl'          : null,
		'encoding'     : 'base64json',
		'clearInvalid' : false, // remove invalid cookies
		'strictHeader' : true // don't allow violations of RFC 6265
	} );

	server.state( 'flowdock', {
		'ttl'          : null,
		'encoding'     : 'base64json',
		'clearInvalid' : false, // remove invalid cookies
		'strictHeader' : true // don't allow violations of RFC 6265
	} );

	server.method( require( './methods/directory' ) );
	server.route( require( './views/routes' ) );
	server.route( require( './api/routes' ) );

	server.views( {

		'engines' : {
			'html' : require( 'handlebars' )
		},

		'relativeTo'   : __dirname,
		'path'         : './templates/views',
		'layoutPath'   : './templates/layout',
		'helpersPath'  : './templates/helpers',
		'partialsPath' : './templates/partials'

	} );

} );

module.exports = new Promise( function ( resolve, reject ) {

	server
		.start( function ( error ) {

			if ( error ) {
				server.log( 'error', error );
				return reject( error );
			}

			return resolve( server );

		} );

} );
