
App.require('Admin', function() {

	var admin = App.Engine('Admin');

	admin.listUsers({}, function(err, results) {

		results.forEach(function(result, index, arr) {
			var $row = $('<tr>');
			var $username = $('<td>').text(result.username);
			var $name = $('<td>').text(result.name);
			var $email = $('<td>').text(result.email);
			var $permission = $('<td>');

			if (!result.permission)
				result.permission = {};

			if (result.permission.admin)
				$permission.text('Admin');

			$row
				.append($username)
				.append($name)
				.append($email)
				.append($permission);

			$row.on('click', function() {
				$('#user_modify').modal('show');
				$('#modify_field_id').val(result._id);
				$('#modify_field_username').val(result.username);
				$('#modify_field_displayname').val(result.name);
				$('#modify_field_email').val(result.email);

				if (result.permission.admin)
					$('#user_modify .toggle.checkbox').checkbox('enable');
				else
					$('#user_modify .toggle.checkbox').checkbox('disable');
			});

			$('#user_table > tbody').append($row);
		});
	});

	$('.ui.sidebar').sidebar();
	$('.ui.modal').modal();
	$('.ui.checkbox').checkbox();
});
