"use strict";

var Validator = require('validator').Validator;

Validator.prototype.clearErrors = function(msg) {

	if (this._objectKey)
		this._objectErrors = {};

	this.errors = [];
};

Validator.prototype.error = function(msg) {

	if (this._objectKey) {
		this._objectErrors[this._objectKey] = msg;
	} else {
		this._errors.push(msg);
	}
};

Validator.prototype.getErrors = function () {
	return this._errors;
}

Validator.prototype.getObjectErrors = function () {

	if (Object.keys(this._objectErrors).length == 0)
		return null;

	return this._objectErrors;
}

Validator.prototype.checkObject = function(obj, key, msg) {
	this._objectKey = key;

	if (!this._objectErrors)
		this._objectErrors = {};


	if (obj instanceof Object)
		return this.check(obj[key], msg);

	return this.check(null, msg);
};

module.exports = Validator;
