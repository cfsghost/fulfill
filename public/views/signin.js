
App.require('User', function() {
	var user = App.Engine('User');

	// Focus on username input box by default
	$('#signin_username').focus();

	$('#signin_submit_btn').on('click', function() {
		var username = $('#signin_username').val();
		var password = $('#signin_password').val();

		$('#signin_submit_btn').addClass('disabled');

		function errHandling(delay) {

			setTimeout(function() {

				// Highlight fields
				$('#signin_field_username').addClass('error');
				$('#signin_field_password').addClass('error');
				$('#signin_field_username .label').text('Please enter username correctly.').transition('fade in');
				$('#signin_field_password .label').text('Please enter password correctly.').transition('fade in');

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
