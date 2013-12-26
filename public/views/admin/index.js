
App.require('Admin', function() {

	var admin = App.Engine('Admin');

	admin.listUsers({}, function(err, results) {

		results.forEach(function(result, index, arr) {
			var $row = $('<tr>').addClass('hover');
			var $control = $('<td>');
			var $username = $('<td>').text(result.username);
			var $name = $('<td>').text(result.name);
			var $email = $('<td>').text(result.email);
			var $permission = $('<td>');

			if (!result.permission)
				result.permission = {};

			if (result.permission.admin)
				$permission.text('admin');

			// Control buttons
			var $editBtn = $('<i>').addClass('icon edit link');

			$editBtn.on('click', function() {
				$('#user_modify')
					.modal('setting', {
						onApprove: function() {

							// Save button was clicked

							// Permission
							$('#modify_field_permission input').each(function() {
								result.permission[$(this).val()] = this.checked;
							});

							// Update user information
							admin.updateUser(result._id, {
								username: $('#modify_field_username').val(),
								name: $('#modify_field_displayname').val(),
								email: $('#modify_field_email').val(),
								permission: result.permission
							}, function(err) {
								$username.text($('#modify_field_username').val());
								$name.text($('#modify_field_displayname').val());
								$email.text($('#modify_field_email').val());

								// Update user list
								var perms = [];
								for (var perm in result.permission) {
									if (result.permission[perm])
										perms.push(perm);
								}

								$permission.text(perms.join(','));
							});
						}
					})
					.modal('show');

				$('#modify_field_username').val(result.username);
				$('#modify_field_displayname').val(result.name);
				$('#modify_field_email').val(result.email);

				if (result.permission.admin) {
					$('#modify_field_permission').checkbox('enable');
				} else {
					$('#modify_field_permission').checkbox('disable');
				}
			});

			$control.append($editBtn);

			// Combine all things
			$row
				.append($control)
				.append($username)
				.append($name)
				.append($email)
				.append($permission);

			$('#user_table > tbody').append($row);
		});
	});

	$('.ui.sidebar').sidebar();
	$('.ui.modal').modal();
	$('.ui.checkbox').checkbox();
});
