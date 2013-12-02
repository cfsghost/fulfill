
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
			inline: true,
			on: 'blur',
			onSuccess: function() {

				var username = $('.ui.form').form('get field', 'username').val();
				var token = $('.ui.form').form('get field', 'token').val();
				var password = $('#reset_password_password').val();

				if (!username || !token)
					return;

				// Reset password
				user.resetPasswordWithToken(username, token, password, function(err) {

					if (err) {
						$('#reset_password_submit_btn').removeClass('disabled');

						if (err.name == 'Failed') {
							$('.ui.error.message .header').text('Failed');
							$('.ui.error.message p').text('Token timeout');
							$('.ui.error.message').transition('fade in');
						}

						return;
					}

					alert('Success');
				});
			}
		});

	$('#reset_password_submit_btn').on('click', function() {

		$('#reset_password_submit_btn').addClass('disabled');

		$('.ui.error.message').addClass('hidden');
	});
});
