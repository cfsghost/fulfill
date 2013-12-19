
App.require('User', function() {
	var user = App.Engine('User');

	var anchor = window.location.hash.replace('#', '') || 'profile';

	function switchPage() {

		var $item = $(this);

		$item.addClass('active');

		$('#sidebar_menu')
			.find('.item')
			.not($item)
			.removeClass('active')
			.each(function() {
				var $this = $(this);
				$('#' + $this.attr('rel') + '_page').addClass('hidden');
				$('#' + $this.attr('rel') + '_page .ui.error.message').removeClass('visible').addClass('hidden');
				$('#' + $this.attr('rel') + '_page .ui.success.message').removeClass('visible').addClass('hidden');
			});

		$('#' + $item.attr('rel') + '_page').removeClass('hidden');
	}

	$('#sidebar_menu .item').on('click', switchPage);

	// Switch to specific page with anchor
	switchPage.bind($('#sidebar_menu').find('[rel=' + anchor + ']')[0])();

	// Validator for profile
	$('#profile_page .ui.form')
		.form({
			name: {
				identifier: 'name',
				rules: [
					{
						type: 'empty',
						prompt: 'Please enter display name'
					}
				]
			}
		}, {
			inline: true,
			on: 'blur',
			onSuccess: function() {

				// Set state of button and messages
				$('#profile_save_submit_btn').addClass('disabled');
				$('#profile_page .ui.error.message').addClass('hidden');
				$('#profile_page .ui.success.message').addClass('hidden');

				var name = $('#form_name').val();

				// Editing user profile
				user.editMyInfo({ displayname: name }, function(err) {

					if (err) {
						$('#profile_save_submit_btn').removeClass('disabled');

						if (err.name == 'Failed') {
							$('#profile_page .ui.error.message .header').text('Failed');
							$('#profile_page .ui.error.message p').text('System has problems');
							$('#profile_page .ui.error.message').transition('fade in');
						}

						return;
					}

					$('#session_username').text(name);

					// Show off success message
					$('#profile_page .ui.success.message .header').text('Update Successful');
					$('#profile_page .ui.success.message p').text('Your profile was saved.');
					$('#profile_page .ui.success.message').transition('fade in');
				});
			}
		});

	// Validator for change password
	$('#password_page .ui.form')
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

				// Set state of butten and messages
				$('#password_save_submit_btn').addClass('disabled');
				$('#password_page .ui.error.message').addClass('hidden');
				$('#password_page .ui.success.message').addClass('hidden');

				var password = $('#form_password').val();

				// Change password
				user.resetMyPassword(password, function(err) {

					if (err) {
						$('#password_save_submit_btn').removeClass('disabled');

						if (err.name == 'Failed') {
							$('#password_page .ui.error.message .header').text('Failed');
							$('#password_page .ui.error.message p').text('System has problems');
							$('#password_page .ui.error.message').transition('fade in');
						}

						return;
					}

					// Clear input box
					$('#form_confirm_password').val('');
					$('#form_password').val('').focus();

					// Show off success message
					$('#password_page .ui.success.message .header').text('Update Successful');
					$('#password_page .ui.success.message p').text('Your password was saved.');
					$('#password_page .ui.success.message').transition('fade in');
				});
			}
		});
});
