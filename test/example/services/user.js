/// <reference path="user.js" />
/// <reference path="shop.js" />
/// <reference path="services.js" />
/// <reference path="../vendor/angularjs/angular-route.js" />
/// <reference path="../vendor/angularjs/angular-route.min.js" />
/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../vendor/angularjs/angular.min.js" />
/// <reference path="../scripts/config.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../scripts/utils.js" />
/// <reference path="auth.js" />


/*
 * 当前用户信息服务
 * author: Alan
 * created: 2016-03-21 15:31
 * 
 */
(function () {
    angular.module(AutoHome.ngModules.services + ".user", [
    ])
    .factory("UserSvc", function ($q, $http) {
        var service = {
            /**
             * 当前用户信息
             */
            info: {
                /**
                 * 用户表Id
                 */
                id: undefined,

                /**
                 * 微信公众号Id
                 */
                developerId: undefined,

                /**
                 * 用户选择的类型: buyer(买车), owner(车主)
                 */
                type: undefined,

                /**
                 * 微信公众号Id
                 */
                appId: undefined,

                /**
                 * 微信用户Id
                 */
                openId: undefined,

                /**
                 * 微信用户头像
                 */
                headImgUrl: undefined,

                /**
                 * 微信用户昵称
                 */
                nickName: undefined,




                //#region 当前绑定的车信息

                /**
                 * 用户所属的经销商Id
                 */
                dealerId: undefined,

                /**
                 * 用户绑定车记录Id
                 */
                userCarId: undefined,

                /**
                 * 用户绑定的车系Id
                 */
                carSeriesId: undefined,

                /**
                 * 用户绑定的车规格Id
                 */
                carSpecId: undefined,

                /**
                 * 用户绑定的车牌号
                 */
                carNo: undefined,

                /**
                 * 用户填写的姓名
                 */
                carUserName: undefined,

                /**
                 * 用户填写的手机号
                 */
                carPhone: undefined,

                //#endregion

                getName: function () {
                    if (this.type === "owner") {
                        return this.carUserName;
                    }
                    return this.nickName;
                },


                cars: [{
                    userCarId: undefined,
                    dealerId: undefined,
                    carSeriesId: undefined,
                    carSpecId: undefined,
                    carType: undefined,
                    carNo: undefined,
                    carUserName: undefined,
                    carPhone: undefined,
                    createDate: undefined
                }]
            },

            /*
             * 用户线索
             */
            orders: [],

            /*
             * 用户所属的公众号信息
             */
            wechat: {
                Alias: "",
                AppID: "",
                CreateTime: "2015-08-26T10:14:37.607",
                DealerID: 0,
                DeveloperID: 0,
                HeadImg: "",
                NickName: "",
                UserName: ""
            },

            /**
             * 登录
             * @param {string} weChatId 微信公众号Id
             * @param {string} userId 微信用户Id
             * @returns {promise} 
             */
            login: function (weChatId, userId) {
                var promise = $http({
                    method: "POST",
                    url: "/Api/Mobile/QueryUser",
                    data: {
                        wechat: weChatId,
                        user: userId
                    }
                });
                promise.then(function (rep) {
                    rep = rep.data;

                    AutoHome.user.openId = service.info.openId = rep.openId;
                    AutoHome.user.appId = service.info.appId = rep.appId;
                    AutoHome.user.dealerId = service.info.dealerId = rep.dealerId;
                    AutoHome.user.id = service.info.id = rep.id;

                    service.info.type = rep.type;

                    service.info.headImgUrl = rep.headImgUrl;
                    service.info.nickName = rep.nickName;
                    service.info.developerId = rep.developerId;

                    service.info.cars = rep.userCars;
                    service.wechat = rep.wechat;

                    if (rep.userCarId && rep.userCarId > 0) {
                        AutoHome.user.type = service.info.type = rep.type;

                        service.info.userCarId = rep.userCarId;
                        service.info.carSeriesId = rep.carSeriesId;
                        service.info.carSpecId = rep.carSpecId;
                        service.info.createDate = rep.createDate;
                        service.info.carNo = rep.carNo;
                        service.info.carUserName = rep.carUserName;
                        service.info.carPhone = rep.carPhone;
                    }

                    //查询线索
                    service.queryOrders().then(function (rep) {
                        service.orders = rep;
                    });

                });
                return promise;
            },


            /**
             * 绑定车信息
             * @param {object} carInfo {carSeriesId, carSpecId, carNo, userName, phone, type}
             * @returns {promise} 
             */
            bindCar: function (carInfo) {
                var errorParams = [];
                if (!this.info.appId) {
                    errorParams.push("微信公众号Id(appId)");
                }
                if (!this.info.openId) {
                    errorParams.push("微信用户Id(openId)");
                }
                if (!this.info.id) {
                    errorParams.push("用户Id(id)");
                }
                if (!this.info.dealerId) {
                    errorParams.push("经销商Id(dealerId)");
                }
                if (!carInfo.carSeriesId) {
                    errorParams.push("车系Id(carSeriesId)");
                }
                if (!carInfo.carSpecId) {
                    errorParams.push("车型Id(carSpecId)");
                }
                if (!carInfo.type) {
                    errorParams.push("用户类型(type)");
                }

                if (carInfo.type === "owner") {

                    if (!carInfo.carNo) {
                        errorParams.push("车牌号(carNo)");
                    }
                    if (!carInfo.userName) {
                        errorParams.push("用户真实姓名(userName)");
                    }
                    if (!carInfo.phone) {
                        errorParams.push("用户手机号(phone)");
                    }
                }
                if (errorParams.length > 0) {
                    throw errorParams.join(",") + " 参数无效.";
                }

                var data = {
                    WeChatId: this.info.appId,
                    OpenId: this.info.openId,
                    User: {
                        UserId: this.info.id,
                        DealerId: this.info.dealerId,
                        CarSeriesId: carInfo.carSeriesId,
                        CarSpecId: carInfo.carSpecId,
                        CarNo: carInfo.carNo,
                        UserName: carInfo.userName,
                        Phone: carInfo.phone,
                        Type: carInfo.type
                    }
                };
                var promise = $http({
                    url: "/Api/Mobile/BindCar",
                    data: data,
                    method: "POST"
                });
                promise.then(function (rep) {
                    rep = rep.data;
                    if (rep.success) {
                        service.info.cars.push(rep.data);
                        angular.extend(service.info, rep.data);

                        AutoHome.user.type = service.info.type = carInfo.type;
                    }
                });
                return promise;
            },

            /**  
             * 换车 
             * @param {int} carSeriesId 车系Id 
             * @param {int} carSpecId 车型Id 
             * @returns {} 
             * 
             * */
            changeCar: function (carSeriesId, carSpecId) {
                var error = [];

                if (!carSeriesId) { error.push("车系Id 不能为空"); }
                if (!carSpecId) { error.push("车型Id 不能为空"); }
                if (error.length) {
                    throw error.join(", ");
                }


                var data = {
                    WeChatId: this.info.appId,
                    OpenId: this.info.openId,
                    User: {
                        UserId: this.info.id,
                        DealerId: this.info.dealerId,
                        CarSeriesId: carSeriesId,
                        CarSpecId: carSpecId,
                        Type: this.info.type
                    }
                };

                var promise = $http({
                    method: "POST",
                    url: "/Api/Mobile/ChangeCar",
                    data: data
                });

                promise.then(function (rep) {
                    rep = rep.data;
                    if (rep.success) {
                        var userCars = rep.data.cars;
                        service.info.cars = userCars;
                        for (var i = 0; i < userCars.length; i++) {
                            if (userCars[i].carType === service.info.type) {
                                angular.extend(service.info, userCars[i]);
                            }
                        }
                    }

                });

                return promise;
            },

            /**
             * 更改账户类型
             * @param {string} appId 微信id
             * @param {string} openId 微信用户Id
             * @param {int} userId 用户Id
             * @param {string} userNewType 用户类型
             * @returns {} 
             */
            changeUserType: function (userNewType) {
                var errors = [];
                if (!userNewType) {
                    errors.push("用户类型不能为空");
                }
                if (errors.length) {
                    throw errors.join(", ");
                }

                var defer = $q.defer();

                var response = { success: false, message: "" };

                /*
                 * 遍历本地的车列表 this.info.cars
                 * 如果有匹配的(类型一样)车信息(UserCars) 直接本地做修改, 并请求服务器修改 dbo.Users.Type 字段值
                 * 如果本地没有匹配的车信息, 返回失败
                 */
                for (var index = 0; index < this.info.cars.length; index++) {
                    var car = this.info.cars[index];
                    if (car.carType === userNewType) {

                        //更新服务器用户类型
                        $http({
                            method: "POST",
                            url: "/Api/Mobile/ChangeUserType",
                            data: {
                                WeChatId: this.info.appId,
                                OpenId: this.info.openId,
                                User: {
                                    UserId: this.info.id,
                                    DealerId: this.info.dealerId,
                                    Type: userNewType
                                }
                            }
                        }).then(function (rep) {
                            rep = rep.data;
                            if (!rep.success) {
                                response.success = false;
                                response.message = rep.message;
                            } else {
                                //更新UserSvc.info.car*信息
                                angular.extend(service.info, car);
                                //更新用户类型
                                AutoHome.user.type = service.info.type = userNewType;
                                response.success = true;
                            }

                            defer.resolve({ data: response });
                        });
                        return defer.promise;
                    }
                }
                if (!response.success) {
                    response.success = false;
                    response.message = "unbind car";
                    defer.resolve({ data: response });
                }

                return defer.promise;
            },

            /**
             * 查询线索
             * @returns {promise} 
             */
            queryOrders: function () {
                var model = {
                    dealerId: this.info.dealerId,
                    devId: this.info.developerId,
                    userId: this.info.id
                };

                if (AutoHome.mode === "dev") {
                    model.dealerId = 2;
                    model.devId = 1;
                    model.userId = 1;
                }

                var defer = $q.defer();

                $http({
                    method: "GET",
                    url: "/Api/Mobile/QueryOrders",
                    params: model
                }).then(function (rep) {
                    rep = rep.data;
                    if (rep.returncode !== 0) {
                        log.e("查询线索返回失败: {0}.".format([rep.message]));
                        defer.reject({ error: rep.message });
                        return;
                    }

                    for (var index = 0; index < rep.result.length; index++) {
                        rep.result[index].StateDesc = rep.result[index].State ? "未分配" : "已分配";
                    }

                    defer.resolve(rep.result);
                }, function (rep) {
                    var cause = "查询线索时服务器响应错误: {code} {desc}".format({ code: rep.status, desc: rep.statusText });
                    log.e(cause);
                    defer.reject({ error: cause });
                });

                return defer.promise;
            }
        };
        return service;
    });
})();