
// Event Emitter
(function(jQuery) {

	jQuery.EventEmitter = {
		_JQInit: function() {
		  this._JQ = jQuery(this);
		},
		emit: function(evt, data) {
			!this._JQ && this._JQInit();
			this._JQ.trigger(evt, Array.prototype.slice.call(arguments).splice(0, 1));
		},
		once: function(evt, handler) {
			!this._JQ && this._JQInit();
			this._JQ.one(evt, handler);
		},
		on: function(evt, handler) {
			!this._JQ && this._JQInit();
			this._JQ.bind(evt, handler);
		},
		off: function(evt, handler) {
			!this._JQ && this._JQInit();
			this._JQ.unbind(evt, handler);
		}
	};

}(jQuery));

var util = {
	inherit: function() {
	}
};
