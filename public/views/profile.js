
App.require(null, function() {

	var anchor = window.location.hash.replace('#', '') || 'profile';

	function switchPage() {

		var $item = $(this);

		$item.addClass('active');

		$('#sidebar_menu')
			.find('.item')
			.not($item)
			.removeClass('active')
			.each(function() {
				$('#' + $(this).attr('rel') + '_page').addClass('hidden');
			});

		$('#' + $item.attr('rel') + '_page').removeClass('hidden');
	}

	$('#sidebar_menu .item').on('click', switchPage);

	// Switch to specific page with anchor
	switchPage.bind($('#sidebar_menu').find('[rel=' + anchor + ']')[0])();

});
