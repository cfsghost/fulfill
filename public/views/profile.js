
App.require(null, function() {

	$('#sidebar_menu .item').on('click', function() {
		var $item = $(this);

		$item.addClass('active');

		$('#sidebar_menu')
			.find('.item')
			.not($item)
			.removeClass('active');
	});


});
