
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

				if ($('#forget_submit_btn').hasClass('disabled'))
					return;

				var email = $('#forget_email').val();

				// Request to reset password right now
				user.generateToken(email, function(err) {

					if (err) {

						// Delay 1 second to avoid that user retry with high frequency
						setTimeout(function() {

							$('#forget_submit_btn').removeClass('disabled');

							if (err.name == 'Failed') {
								$('#forget_field_email').addClass('error');
								$('.ui.error.message .header').text('Failed to request');
								$('.ui.error.message p').text('You must enter a correct e-mail');
								$('.ui.error.message').transition('fade in');
							}

						}, 1000);
						return;
					}

					// Hide form
					$('#forget_form').fadeOut();

					// Show off success message
					$('.ui.success.message .header').text('Requested Password Reset');
					$('.ui.success.message p').text('Please check your e-mail box. A message will be sent to that address containing a link to rest your password.');
					$('.ui.success.message').transition('fade in');

					// Success then redirect to home
					//window.location = '/';
				});
			}
		});

	$('#forget_submit_btn').on('click', function() {

		$('#forget_submit_btn').addClass('disabled');

		$('.ui.error.message').addClass('hidden');
	});
});
