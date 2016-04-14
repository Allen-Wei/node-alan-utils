/// <reference path="../_config.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../vendor/angularjs/angular.js" />

/*
 * 选择车系车型
 * author: Alan
 * created: 2016-03-26
 */

(function () {
    angular.module(AutoHome.ngModules.directives + ".selectSeries", [
        AutoHome.ngModules.services + ".shop"
    ])
        .directive("selectSeries", function (ShopSvc, UserSvc, $timeout) {
            return {
                restrict: "AE",
                templateUrl: "directives/select-series.html",
                controller: function ($scope) {
                    var main = $scope.main = {
                        seriesName: $scope.seriesName || "经销商名字为空",

                        //加载车系列表数据
                        loadFactories: function () {
                            ShopSvc.getSeries(UserSvc.info.dealerId)
                                .then(function (rep) {
                                    rep = rep.data;
                                    if (rep.returncode !== 0) {
                                        throw new "获取车系列表失败: " + rep.message;
                                    }
                                    var svrFactories = rep.result.list;
                                    for (var x = 0; x < svrFactories.length; x++) {
                                        var svrFactory = svrFactories[x];
                                        var locFactory = {
                                            factoryId: svrFactory.FactoryId,
                                            factoryName: svrFactory.FactoryName,
                                            series: []
                                        };
                                        for (var y = 0; y < svrFactory.SeriesList.length; y++) {
                                            var svrSeries = svrFactory.SeriesList[y];
                                            locFactory.series.push({
                                                imageUrl: svrSeries.ImageUrl,
                                                maxPrice: svrSeries.MaxPrice,
                                                minPrice: svrSeries.MinPrice,
                                                seriesId: svrSeries.SeriesId,
                                                seriesName: svrSeries.SeriesName
                                            });
                                        }

                                        main.factories.push(locFactory);
                                    }

                                }, function () {
                                    throw "获取车系列表失败";
                                });
                        },
                        //获取车系详情数据
                        loadCars: function () {

                            ShopSvc.getSeriesDetail(AutoHome.user.dealerId, this.selected.series.seriesId)
                                .then(function (rep) {
                                    rep = rep.data;
                                    if (!rep || rep.returncode !== 0) {
                                        alert(rep.message);
                                        throw rep.message;
                                    }

                                    var svrSeries = rep.result.list[0];
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
                                        }
                                    }
                                    main.cars = locCars;

                                }, function (rep) {
                                    alert("请求失败: {code} {status}.".format({ code: rep.status, status: rep.statusText }));
                                });
                        },
                        visible: {
                            screen: "factories"
                        },
                        //厂商车系列表
                        factories: [],
                        //车型列表
                        cars: [],
                        //选中后的车系车型
                        selected: {
                            series: {},
                            car: {}
                        },
                        //单击车系
                        factoryClick: function (series) {
                            this.selected.series = series;
                            this.cars = [];
                            this.loadCars();
                            this.visible.screen = "cars";
                        },
                        //取消选择
                        cancel: function () {
                            var cancel = $scope.onCancel();
                            if (typeof (cancel) === "function") {
                                cancel();
                            }
                        },
                        //单击车型
                        carClick: function (car) {
                            this.selected.car = car;
                            if (!$scope.onComplete) {
                                log.e("complete undefined: ", $scope.onComplete);
                                return;
                            }
                            var callback = $scope.onComplete();

                            if (typeof (callback) === "function") {
                                $timeout(function () {
                                    callback.apply($scope, [main.selected.series, main.selected.car]);
                                }, 1);
                            }
                        },
                        //重置
                        reset: function () {
                            this.visible.screen = "factories";
                            this.loadFactories();
                        }
                    };
                    //恢复到车系列表
                    $scope.reset = function () {
                        main.visible.screen = "factories";
                    };
                    main.reset();
                },
                scope: { onComplete: "&", onCancel: "&", seriesName: "=" }
            };
        });
})();