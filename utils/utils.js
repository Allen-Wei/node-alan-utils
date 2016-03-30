
module.exports = {
	extend: function (to, from) {
		for (var key in from) {
			to[key] = from[key];
		}
		return this;
	},
	
	/**
	 * 格式化字符串
	 * @param {object/array} data 可以是数组或者JSON
	 * @returns {string}
	 */
	format: function (data) {
		var args = arguments;
		var paras = Array.prototype.splice.call(args, 1, args.length - 1);
		
		var fnReg = /\{\{([\w\s\+\.\(\)'\-";]+)\}\}/g;
		var fnText = this.replace(fnReg, function (g0, g1) {
			var innerFunction = new Function(g1);
			return innerFunction.apply(data, paras);
		});
		
		var placeHoldReg = /\{(\w+|\d*|_*)\}/g;
		return fnText.replace(placeHoldReg, function (g0, g1) {
			var value = data[g1];
			return typeof (value) === "function" ? value.apply(data, paras) : value;
		});
	}
};