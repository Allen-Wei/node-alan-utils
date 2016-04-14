
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
	},
	
	/**
	 * 获取对象的属性值
	 * @param {object} obj 对象
	 * @param {string} propNames 属性名(递归属性以点号分隔)
	 * @returns {object}
	 */
	query: function (obj, propNames) {
		if (!obj) return obj;
		
		var properties = (propNames || "").split(".");
		if (properties.length <= 0) return obj;
		if (properties.length === 1) return obj[properties[0]];
		
		var firstProp = properties.splice(0, 1);
		return Object.query(obj[firstProp], properties.join("."));
	}

};