
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

	// Validator
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

				var name = $('#form_name').val();

				// Reset password
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

	$('#profile_save_submit_btn').on('click', function() {

		$('#profile_save_submit_btn').addClass('disabled');

		$('#profile_page .ui.error.message').addClass('hidden');
	});
});
