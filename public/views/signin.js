
App.require('User', function() {
	var user = App.Engine('User');

	// Focus on username input box by default
	$('#signin_username').focus();

	// Enter event
	$('#signin_field_username').on('keydown', function(event) {
		if (event.keyCode == 13) {
			if (!$('#signin_submit_btn').hasClass('disabled'))
				$('#signin_submit_btn').trigger('click');
		}
	});

	$('#signin_field_password').on('keydown', function(event) {
		if (event.keyCode == 13) {
			if (!$('#signin_submit_btn').hasClass('disabled'))
				$('#signin_submit_btn').trigger('click');
		}
	});

	$('#signin_submit_btn').on('click', function() {
		var username = $('#signin_username').val();
		var password = $('#signin_password').val();

		$('#signin_submit_btn').addClass('disabled');

		function errHandling(delay) {

			setTimeout(function() {

				$('.ui.error.message .header').text('Failed to sign in');
				$('.ui.error.message p').text('Please enter correct username and password.');
				$('.ui.error.message').transition('fade in');

				// Highlight fields
				$('#signin_field_username').addClass('error');
				$('#signin_field_password').addClass('error');

				$('#signin_submit_btn').removeClass('disabled');

				// Focus on username input box
				$('#signin_username').focus();
			}, delay);
		}

		// Empty
		if (username == '' || password == '') {
			errHandling(0);
			return;
		}

		// Authroization
		user.auth(username, password, function(err, success) {

			if (!success) {
				errHandling(1000);
				return;
			}

			// Success then redirect to home
			window.location = '/';

		});
	});
});
