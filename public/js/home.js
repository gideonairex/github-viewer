$( document ).ready( function () {

	$( '.create-thread' ).click( function ( e ) {
		var repoPR = e.target.id.split( '-create-thread' )[ 0 ].split( '*' );
		var repo   = repoPR[ 1 ];
		var pr     = repoPR[ 0 ];

		$.ajax( {
			'method' : 'post',
			'url' : '/repos/' + repo + '/' + pr + '/comments',
			'data' : {
				'topic' : $( '#topic-' + pr + '-' + repo ).val()
			},
			'dataType' : 'json'
		} )
		.done( function ( comment ) {
			var table = 'list-' + pr + '-' + repo + '-create-thread';
			$( '#' + table ).append( '<tr><td><a target=_blank href="https://www.flowdock.com/app/school-improvement-network/chix-chips/threads/' + comment.thread_id + '">' + comment.content.split( ':::' )[ 1 ] + '</a></td></tr>' );
		} );

	} );

	$( '.fetch-pr-status' ).click( function ( e ) {
		var repo = e.target.id.split( 'fetch-' )[ 1 ];

		$.ajax( {
			'url' : '/repos/' + repo + '/pulls',
		} )
		.done( function ( data ) {

			data.forEach( function ( pr ) {

				$.ajax( {
					'url' : '/repos/' + repo + '/' + pr.number + '/comments',
				} )
				.done( function ( comments ) {

					comments.forEach( function ( comment ) {

						if ( comment.body.indexOf( '[THREAD' ) > -1 ) {
							var thread = comment.body.split( '\n Open thread:' )[ 0 ];
							var topic = comment.body.split( '\n Open thread:' )[ 1 ].split( '](https' )[ 0 ].trim();
							var cleaned_topic = topic.substr( 1, topic.length );
							var thread_id = thread.split( '[THREAD:' )[ 1 ];
							var cleaned_thread_id = thread_id.substr( 0, thread_id.length - 1 );
							var table = 'list-' + pr.number + '-' + repo + '-create-thread';
							$( '#' + table ).append( '<tr><td><a target=_blank href="https://www.flowdock.com/app/school-improvement-network/chix-chips/threads/' + cleaned_thread_id + '">' + cleaned_topic + '</a></td></tr>' );
						}

					} );

					if ( comments.length > 0 ) {
						if( comments[ comments.length - 1 ].body.indexOf( '[TL:Ready]') > -1 ){
							$( '#' + repo + '-' + pr.number + '-status' ).html( '<span class="label label-success">Ready</span> ' );
						} else if( comments[ comments.length - 1 ].body.indexOf( '[D:Ready]') > -1){
							$( '#' + repo + '-' + pr.number + '-status' ).html( '<span class="label label-info">Updated</span> ' );
						} else {
							$( '#' + repo + '-' + pr.number + '-status' ).html( '<span class="label label-danger">Need to fix</span> ' );
						}
						$( '#' + repo + '-' + pr.number + '-time' ).html( moment( comments[ comments.length - 1 ].created_at ).fromNow() );
					} else {
							$( '#' + repo + '-' + pr.number + '-status' ).html( '<span class="label label-default">Need verification</span> ' );
					}
				} );

			} );

		} );

	} );

} );
