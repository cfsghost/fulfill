
App.require('User', function() {
	var user = App.Engine('User');

	$('.popup').popup();

	// Focus on display name input box by default
	$('#signup_displayname').focus();

	$('#signup_submit_btn').on('click', function() {
		var displayName = $('#signup_displayname').val();
		var email = $('#signup_email').val();
		var password = $('#signup_password').val();
		var confirmPassword = $('#signup_confirm_password').val();

//		$('#signup_submit_btn').addClass('disabled');

		function errHandling(delay) {

			setTimeout(function() {

				// Highlight fields
				$('#signup_field_displayname').addClass('error');
				$('#signup_field_email').addClass('error');
				$('#signup_field_password').addClass('error');
				$('#signup_field_confirm_password').addClass('error');

				$('#signup_field_displayname .label').text('Please enter display name.').transition('fade in');
				$('#signup_field_email .label').text('Please enter your email.').transition('fade in');
				$('#signup_field_password .label').text('Please enter password').transition('fade in');
				$('#signup_field_confirm_password .label').text('Please re-enter password').transition('fade in');

				$('#signup_submit_btn').removeClass('disabled');

				// Focus on email input box
				$('#signup_displayname').focus();
			}, delay);
		}

		// Empty
		if (displayName == '' || email == '' || password == '' || confirmPassword == '') {
			errHandling(0);
			return;
		}

		// Sign up now
		user.signUp({ email: email }, function(success) {
/*
			if (!success) {
				errHandling(1000);
				return;
			}
*/
			// Success then redirect to home
			//window.location = '/';

		});
	});
});
