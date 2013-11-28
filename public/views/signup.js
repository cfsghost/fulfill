
App.require('User', function() {
	var user = App.Engine('User');

	$('#signup_submit_btn').on('click', function() {

		if ($('#signup_username').val() == '' || $('#signup_password').val() == '') {
			return;
		}
	});
});
