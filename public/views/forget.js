
App.require('User', function() {
	var user = App.Engine('User');

	// Focus on display name input box by default
	$('#forget_email').focus();

	// Validator
	$('.ui.form')
		.form({
			email: {
				identifier: 'email',
				rules: [
					{
						type: 'empty',
						prompt: 'Please enter your email'
					},
					{
						type: 'email',
						prompt: 'Please enter valid email'
					}
				]
			}
		}, {
			inline: true,
			on: 'blur',
			onSuccess: function() {

				return;
				var email = $('#forget_email').val();

				// Sign up now
				user.signUp({
					displayname: displayName,
					email: email,
					password: password
				}, function(err) {

					if (err) {

						$('#forget_submit_btn').removeClass('loading disabled');

						if (err.name == 'Failed') {
							$('#forget_field_email').addClass('error');
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

	$('#forget_submit_btn').on('click', function() {

		$('#forget_submit_btn').addClass('loading disabled');

		$('.ui.error.message').addClass('hidden');
	});
});
