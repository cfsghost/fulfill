
App.require('User', function() {
	var user = App.Engine('User');

	// Focus on display name input box by default
	$('#signup_displayname').focus();

	// Validator
	$('.ui.form')
		.form({
			name: {
				identifier: 'name',
				rules: [
					{
						type: 'empty',
						prompt: 'Please enter display name'
					}
				]
			},
			email: {
				identifier: 'email',
				rules: [
					{
						type: 'empty',
						prompt: 'Please enter your e-mail'
					},
					{
						type: 'email',
						prompt: 'Please enter valid e-mail'
					}
				]
			},
			password: {
				identifier: 'password',
				rules: [
					{
						type: 'empty',
						prompt: 'Please enter your password'
					}
				]
			},
			confirmPassword: {
				identifier: 'confirm-password',
				rules: [
					{
						type: 'empty',
						prompt: 'Please enter your password again'
					},
					{
						type: 'match[password]',
						prompt: 'Password doesn\'t match'
					}
				]
			}
		}, {
			inline: true,
			on: 'blur',
			onSuccess: function() {

				if ($('#signup_submit_btn').hasClass('disabled'))
					return;

				var displayName = $('#signup_displayname').val();
				var email = $('#signup_email').val();
				var password = $('#signup_password').val();
				var confirmPassword = $('#signup_confirm_password').val();

				// Sign up now
				user.signUp({
					displayname: displayName,
					email: email,
					password: password
				}, function(err) {

					if (err) {

						$('#signup_submit_btn').removeClass('disabled');

						if (err.name == 'Failed') {
							$('#signup_field_email').addClass('error');
							$('.ui.error.message .header').text('Failed to sign up');
							$('.ui.error.message p').text('Your Email exists already.');
							$('.ui.error.message').transition('fade in');
						}
						return;
					}

					// Success then redirect to home
					window.location = '/';
				});
			}
		});

	$('#signup_submit_btn').on('click', function() {

		$('#signup_submit_btn').addClass('disabled');

		$('.ui.error.message').addClass('hidden');
	});
});
