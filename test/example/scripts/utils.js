
/**
 * 获取查询字符串
 * @param {string} url URL
 * @param {string} key 键
 * @returns {string} 
 */
location.params = function (url, key) {

    if (!url) return null;
    if (typeof (url) !== "string") return null;

    if (arguments.length === 1) {
        var indexOfQuestionMark = url.indexOf("?");
        if (indexOfQuestionMark === -1) return null;
        var indexOfHash = url.indexOf("#");
        var searchSubEnd = (indexOfHash === -1 ? url.length : indexOfHash - indexOfQuestionMark) - 1;
        var search = url.substr(indexOfQuestionMark + 1, searchSubEnd);
        if (!search) return null;
        var params = search.split("&");
        var result = {};
        for (var index = 0; index < params.length; index++) {
            var keyValue = (params[index] || "").split("=");
            result[keyValue[0]] = decodeURIComponent(keyValue[1]);
        }
        return result;
    }
    if (arguments.length === 2) {
        return (location.params(url) || {})[key];
    }
    return null;
};
/**
 * cookie查询
 * @param {string} name Cookie Name
 * @returns {} 
 */
document.getCookie = function (name) {
    if (!document.cookie) return null;
    var cookies = document.cookie.split(";");
    for (var index = 0; index < cookies.length; index++) {
        var cookieKeyValue = cookies[index].split("=");
        if (cookieKeyValue.length !== 2) continue;
        if (cookieKeyValue[0].trim() === name) {
            return cookieKeyValue[1];
        }
    }
    return null;
};
/**
 * 格式化字符串
 * @param {JSON} data 数据
 * @returns {string} 
 */
String.prototype.format = function (data) {
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
};

/**
 * 格式化字符串
 * @param {string} template 带有占位符的字符串模板
 * @param {object} data JSON格式数据
 * @returns {string} 
 */
String.format = function (template, data) {
    if (!template || !template.toString) return undefined;
    return template.toString().format(data);
};

/**
 * 利用JSON转换克隆对象(取消引用)
 * @param {object} data 
 * @returns {object} 
 */
Object.clone = function (data) {
    return JSON.parse(JSON.stringify(data));
};

/**
 * 获取对象之
 * @param {object} obj 对象
 * @param {string} propNames 属性名
 * @returns {} 
 */
Object.query = function (obj, propNames) {
    if (!obj) return obj;

    var properties = (propNames || "").split(".");
    if (properties.length <= 0) return obj;
    if (properties.length === 1) return obj[properties[0]];

    var firstProp = properties.splice(0, 1);
    return Object.query(obj[firstProp], properties.join("."));
};
