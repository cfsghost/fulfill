
// Node.js style Event Emitter
(function(jQuery) {

	jQuery.EventEmitter = {
		_JQInit: function() {
		  this._JQ = jQuery(this);
		},
		emit: function(evt, data) {
			!this._JQ && this._JQInit();
			var args = Array.prototype.slice.call(arguments);
			args.splice(0, 1);
			this._JQ.trigger(evt, args);
		},
		once: function(evt, handler) {
			!this._JQ && this._JQInit();
			this._JQ.one(evt, function() {
				var args = Array.prototype.slice.call(arguments);
				args.splice(0, 1);
				handler.apply(this, args);

				return false;
			});
		},
		on: function(evt, handler) {
			!this._JQ && this._JQInit();
			this._JQ.bind(evt, function() {
				var args = Array.prototype.slice.call(arguments);
				args.splice(0, 1);
				handler.apply(this, args);

				return false;
			});
		},
		off: function(evt, handler) {
			!this._JQ && this._JQInit();
			this._JQ.unbind(evt, handler);
		}
	};

}(jQuery));
