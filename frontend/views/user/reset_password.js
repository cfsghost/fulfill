
App.require('User', function() {
	var user = App.Engine('User');

	// Focus on display name input box by default
	$('#reset_password_password').focus();

	// Validator
	$('.ui.form')
		.form({
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
			onSuccess: function() {

				// Set state of button and messages
				$('#reset_password_submit_btn').addClass('disabled');
				$('.ui.error.message').addClass('hidden');
				$('.ui.success.message').addClass('hidden');

				var id = $('.ui.form').form('get field', 'id').val();
				var token = $('.ui.form').form('get field', 'token').val();
				var password = $('#reset_password_password').val();

				if (!id || !token)
					return;

				// Reset password
				user.resetPasswordWithToken(id, token, password, function(err) {

					if (err) {
						$('#reset_password_submit_btn').removeClass('disabled');

						if (err.name == 'Failed') {
							$('.ui.error.message .header').text('Failed');
							$('.ui.error.message p').text('Token timeout');
							$('.ui.error.message').transition('fade in');
						}

						return;
					}

					// Hide form
					$('#reset_password_form').fadeOut();

					// Show off success message
					$('.ui.success.message .header').text('Reset Password Successful');
					$('.ui.success.message p').text('Your password has been reset successfully!');
					$('.ui.success.message').transition('fade in');
				});
			}
		});
});
