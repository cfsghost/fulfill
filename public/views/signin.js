
App.require('User', function() {
	var user = App.Engine('User');

	$('.popup').popup();

	// Focus on username input box by default
	$('#signin_username').focus();

	$('#signin_submit_btn').on('click', function() {

		if ($('#signin_username').val() == '' || $('#signin_password').val() == '') {

			$('#signin_field_username').addClass('error');
			$('#signin_field_password').addClass('error');

			$('#signin_username').focus();
			return;
		}
	});
});
