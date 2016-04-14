/// <reference path="../_config.js" />
/// <reference path="../../vendor/angularjs/angular.js" />
/// <reference path="user.js" />


/*
 * 车系车型相关
 * author: Alan
 * created: 2016-03-21 15:33
 */
(function () {
    angular.module(AutoHome.ngModules.services + ".shop", [
    ])
        .factory("ShopSvc", function ($http, $q) {

            var service = {
                /**
                 * 用户选中的车系车型信息
                 */
                selected: {
                    /**
                     * 用户选中的车系
                     */
                    series: undefined,

                    /**
                     * 用户选中的车型
                     */
                    car: undefined,
                    /**
                     * 选完车型之后的跳转页面
                     */
                    redirect: ""
                },
                /**
                 * 已经选中的车系车型
                 */
                confirm: {
                    series: undefined,
                    car: undefined
                },

                /**
                 * 获取车系列表
                 * @param {int} dealerId 店铺Id
                 * @returns {车系列表} 
                 */
                getSeries: function (dealerId) {
                    var promise = $http({
                        url: "/Api/Mobile/Series/" + dealerId,
                        method: "GET"
                    });
                    return promise;
                },

                /**
                 * 获取车系详细信息
                 * @param {int} dealerId 店铺Id
                 * @param {int} seriesId 车系Id
                 * @returns {id:int, name: string, cars: array} 
                 */
                getSeriesDetail: function (dealerId, seriesId) {
                    if (arguments.length < 2) {
                        throw "less than two parameters.";
                    }

                    var promise = $http({
                        url: "/Api/Mobile/SeriesDetail/" + dealerId + "/" + seriesId,
                        method: "GET"
                    });

                    return promise;
                },

                /**
                 * 从服务器拉取最新的绑定的车信息 并更新 service.confirm 信息
                 * @param {int} dealerId 经销商Id
                 * @param {int} seriesId 车系Id
                 * @param {int} specId 车型Id
                 * @returns {} 
                 */
                updateSelectedInfo: function (dealerId, seriesId, specId) {

                    this.getSeriesDetail(dealerId, seriesId)
                        .then(function (rep) {
                            rep = rep.data;
                            if (rep.returncode !== 0) {
                                throw String.format("更新用户绑定的车型信息失败: {msg}", { msg: rep.message });
                            }

                            var svrSeries = rep.result.list[0] || { Transmissions: [], Specs: { key: [] } };

                            var locCars = {
                                seriesId: svrSeries.SeriesId,
                                imageUrl: svrSeries.Imageurl,
                                seriesMaxPrice: svrSeries.SeriesMaxPrice,
                                seriesMinPrice: svrSeries.SeriesMinPrice,
                                seriesName: svrSeries.SeriesName,
                                sransmission: svrSeries.Transmissions[0],
                                specials: []
                            };
                            for (var key in svrSeries.Specs) {
                                var svrSpecs = svrSeries.Specs[key];
                                for (var index = 0; index < svrSpecs.length; index++) {
                                    var svrSpec = svrSpecs[index];
                                    locCars.specials.push({
                                        baseName: key,
                                        maxPrice: svrSpec.MaxPrice,
                                        price: svrSpec.Price,
                                        priceOff: svrSpec.PriceOff,
                                        specId: svrSpec.SpecId,
                                        specName: svrSpec.SpecName
                                    });

                                    if (svrSpec.SpecId === specId) {
                                        service.confirm.car = svrSpec;
                                    }
                                }
                            }
                            service.confirm.series = locCars;

                        });
                },

                /**
                 * 获取经销商优惠促销列表
                 * @param {int} dealerId 经销商Id
                 * @param {string} keyword 包含关键字
                 * @returns {promise} 
                 */
                getPromotions: function (dealerId, keyword) {
                    var defer = $q.defer();
                    var promise = $http({
                        method: "GET",
                        url: "/Api/Mobile/QueryPromotions/" + dealerId
                    }).then(function (rep) {
                        /*
                         * {"returncode":0,"message":"","result":{"rowcount":15,"pagecount":8,"pageindex":1,"list":[{
                         *      "newsId":56723028,
                         *      "title":"哈弗H6 Coupe限时优惠 让利高达1.6万",
                         *      "createTime":"\/Date(1460523135470+0800)\/",
                         *      "endDate":"\/Date(1460563200000+0800)\/",
                         *      "publishTime":"\/Date(1460523135470+0800)\/",
                         *      "imgUrl":"http://car0.autoimg.cn/car/carnews/2015/7/15/620x465_1_q87_201507150629057703450110.jpg"
                         *  }]}}
                         */
                        rep = rep.data;
                        if (rep && rep.returncode === 0) {
                            var result = rep.result.list || [];
                            var matchedItems = [];
                            for (var index = 0; index < result.length; index++) {
                                var item = result[index];
                                if (keyword) {
                                    if (item.title.indexOf(keyword) === -1) {
                                        continue;
                                    }
                                }
                                matchedItems.push({
                                    id: item.newsId,
                                    title: item.title,
                                    image: item.imgUrl,
                                    url: "http://dealer.m.autohome.com.cn/{dealer}/news{news}".format({ dealer: dealerId, news: item.newsId })
                                });
                            }
                            defer.resolve(matchedItems);
                            return;
                        }

                        defer.reject();
                    }, function (rep) {
                        defer.reject();
                    });

                    return defer.promise;
                },
                /**
                 * 获取游戏列表
                 * @param {int} developerId 公众号Id
                 * @returns {promise} 
                 */
                getGames: function (developerId) {

                    var defer = $q.defer();

                    $http({
                        method: "GET",
                        url: "/Api/Mobile/QueryGames/" + developerId
                    }).then(function(rep) {
                        rep = rep.data;
                        if (rep && rep.success) {
                            defer.resolve(rep.data);
                        } else {
                            defer.reject(rep.message);
                        }
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }
            };
            return service;
        });
})();