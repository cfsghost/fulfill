
App.require('User', function() {
	var user = App.Engine('User');

	$('.popup').popup();

	$('#signup_submit_btn').on('click', function() {

		if ($('#signup_username').val() == '' || $('#signup_password').val() == '') {
			return;
		}
	});
});
