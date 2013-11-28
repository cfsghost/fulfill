
App.require('User', function() {
	var user = App.Engine('User');

	$('.popup').popup();

	$('#signin_submit_btn').on('click', function() {

		if ($('#signin_username').val() == '' || $('#signin_password').val() == '') {
			return;
		}
	});
});
