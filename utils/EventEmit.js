var EventEmit = function () {
	
	//内部变量, 存储事件
	var eventStore = {
		exampleEventName: [{
				id: "用于监听标识, 主要用于注销事件.",
				callback: function () { /*回调*/ },
				current: {},
				/*回调执行时的当前对象*/
				one: false /*是否是一次性监听*/
			}]
	};
	
	/**
     * 获取事件
     * @returns {} 
     */
    this.getEventStore = function () {
		return eventStore;
	};
	
	/**
     * 触发事件 (剩余的参数将会被依次传递到回调函数里)
     * @param {string} eventNames 事件名称(以空格分隔多个事件)
     * @param {object} current 回调函数中的this
     * @returns {this} 
     */
    this.emit = function (eventNames, current) {
		if (!eventNames || typeof (eventNames) !== "string") {
			return this;
		}
		
		var names = eventNames.split(" ");
		for (var index = 0; index < names.length; index++) {
			var eventName = names[index];
			
			var events = eventStore[eventName];
			if (!events || events.length <= 0) {
				continue;
			}
			for (var i = 0; i < events.length; i++) {
				var evt = events[i];
				var callabck = evt.callback || function () { };
				var args = Array.prototype.slice.call(arguments, 2, arguments.length);
				/*
                 * 优先使用订阅事件时传递的this
                 * 如果注册时事件传递了current, 则回调函数的当前对象为注册时传递的current
                 * */
                try { callabck.apply(evt.current || current || this, args); } catch (ex) { }
				
				if (evt.one) {
					events.splice(i, 1);
				}
			}
		}
		
		return this;
	};
	
	
	/**
     * 订阅事件
     * @param {string} eventNames 事件名称
     * @param {function} callback 事件触发时的回调
     * @param {string} eventId 事件标识
     * @param {object} current 回调函数中的this
     * @param {bool} isOne 是否是一次订阅
     * @returns {this} 
     */
    this.on = function (eventNames, callback, eventId, current, isOne) {
		if (!eventNames || typeof (eventNames) !== "string") {
			return this;
		}
		
		var names = eventNames.split(" ");
		for (var index = 0; index < names.length; index++) {
			var eventName = names[index];
			
			if (eventStore[eventName] === undefined) {
				eventStore[eventName] = [];
			}
			var events = eventStore[eventName];
			if (eventId) {
				/* 如果传递了 eventId, 通过赋值的方式注册事件, 这意味着在事件的注册表里, 同一个事件标识只能出现一次. */
				for (var i = 0; i < events.length; i++) {
					if (events[i]["id"] === eventId) {
						events[i] = {
							id: eventId,
							callback: callback,
							current: current,
							one: !!isOne
						};
						continue;
					}
				}

			}
			events.push({
				id: eventId || Date.now(),
				callback: callback,
				current: current,
				one: !!isOne
			});
		}
		
		
		
		return this;
	};
	
	/**
     * 订阅发布即焚(一次性事件)事件
     * @param {string} eventNames 事件名称
     * @param {function} callback 事件订阅回调
     * @param {string} eventId 事件标识
     * @param {object} current 回掉函数中的this
     * @returns {this} 
     */
    this.one = function (eventNames, callback, eventId, current) {
		this.on(eventNames, callback, eventId, current, true);
	};
	
	
	/**
     * 取消订阅
     * @param {string} eventName 事件名称
     * @param {string} eventId 事件标识(on注册事件时传递的唯一值)
     * @returns {this} 
     */
    this.off = function (eventName, eventId) {
		var events = eventStore[eventName];
		if (!events || events.length <= 0) {
			return this;
		}
		
		if (arguments.length === 1) {
			/*如果没有传递eventId, 表示注销所有事件.*/
			eventStore[eventName] = [];
			return this;
		}
		
		for (var i = 0; i < events.length; i++) {
			var evt = events[i];
			if (evt["id"] === eventId) {
				events.splice(i, 1);
			}
		}
		return this;
	};
	
	/**
     * 事件是否已经存在
     * @param {string} eventName 事件名称
     * @param {string} eventId 事件标识
     * @returns {bool}  是否存在
     */
    this.isExist = function (eventName, eventId) {
		var events = eventStore[eventName] || [];
		for (var i = 0; i < events.length; i++) {
			var found = events[i]["id"] === eventId;
			if (found) {
				return true;
			}
		}
		return false;
	};

};


/**
 * 继承 aUtils.EventBase
 * @param {function} fn 继承 aUtils.EventBase
 * @returns {this} 
 */
EventEmit.implement = function (fn) {
	fn.prototype = new aUtils.EventBase();
	fn.prototype.constructor = fn;
	return this;
};

module.exports = EventEmit;
