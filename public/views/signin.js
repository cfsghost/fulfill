
App.require('User', function() {
	var user = App.Engine('User');

	$('.popup').popup();

	// Focus on username input box by default
	$('#signin_username').focus();

	$('#signin_submit_btn').on('click', function() {
		var username = $('#signin_username').val();
		var password = $('#signin_password').val();

		// Empty
		if (username == '' || password == '') {

			// Highlight fields
			$('#signin_field_username').addClass('error');
			$('#signin_field_password').addClass('error');

			// Focus on username input box
			$('#signin_username').focus();

			return;
		}

		// Authroization
		user.auth(username, password, function(success) {
			if (!success) {

				// Highlight fields
				$('#signin_field_username').addClass('error');
				$('#signin_field_password').addClass('error');

				// Focus on username input box
				$('#signin_username').select().focus();

				return;
			}

		});
	});
});
