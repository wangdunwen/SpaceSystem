/**
 * Created by wangdunwen on 2017/1/16.
 */
define(['../utils/Tools'],
    function (Tool) {

    var tool = new Tool();
    var routeCollection = [];

    var locationManager = function () {

        viewer.infoBox._container.style.display = "none";

        var scene = viewer.scene;
        var that = this;
        this.locationHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        this.startPointHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        this.endPointHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        var startPoint, endPoint;
        var startLocation, endLocation;
        var ellipsoid = scene.globe.ellipsoid;

        //卫星定位
        $("#locationOnline").click(function() {
            if ($("#locationOnlinePanel").is(":hidden")) {
                $("#locationOnlinePanel").show();
            } else {
                $("#locationOnlinePanel").hide();
            }
        });

        //路径规划
        $("#routePlan").click(function() {
            if ($("#routePlanPanel").is(":hidden")) {
                $("#routePlanPanel").show();
                $("#descriptionRoutePlan").html("<div>" +
                    "起始点：<span id='startPointInfo' style='margin:3px;text-align: center'></span><br>" +
                    "终点：<span id='endPointInfo' style='margin:3px;text-align: center'></span><br>" +
                    "<br/>" +
                    "<div id='routePlanDescription'></div>" +
                    "</div>");
            } else {
                if (!that.startPointHandler.isDestroyed()) {
                    that.startPointHandler.destroy();
                }
                if (!that.endPointHandler.isDestroyed()) {
                    that.endPointHandler.destroy();
                }
                $("#descriptionRoutePlanPanel").hide();
                $("#routePlanPanel").hide();
            }
        });

        /*选取起始点*/
        $("#selectStartPoint").click(function() {
            $("#routePlanDescription").html("");
            $("#descriptionRoutePlanPanel").show();
            that.startPointHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            that.startPointHandler.setInputAction(function (event) {
                var windowPosition = getPosition(event);
                var pickedObject = scene.pick(windowPosition);
                var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                var location = tool.cartesianToCoords(ellipsoid, cartesian);
                startLocation = location;
                var searchUrl = "http://restapi.amap.com/v3/geocode/regeo?output=json&location="+ location.longitude +"," + location.latitude +"&key=102a6884c29164d01d8087aeaf795cc1&radius=1000&extensions=all";
                $.ajax({
                    type: "get",
                    async: false,
                    url: searchUrl,
                    success: function (json) {
                        $("#startPointInfo").html(json.regeocode.formatted_address);
                    },
                    error: function () {
                        console.log("fail");
                    }
                });
                if(startPoint) {
                    startPoint.position = cartesian;
                }else {
                    startPoint = viewer.entities.add({
                        name: '点',
                        position: cartesian,
                        point: {
                            color: Cesium.Color.BLUE,
                            pixelSize: 10,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 1
                        }
                    });
                }
                if (!that.startPointHandler.isDestroyed()) {
                    that.startPointHandler.destroy();
                }
            },Cesium.ScreenSpaceEventType.LEFT_DOWN);
        });

        /*选取终点*/
        $("#selectEndPoint").click(function() {
            $("#routePlanDescription").html("");
            $("#descriptionRoutePlanPanel").show();
            that.endPointHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            that.endPointHandler.setInputAction(function (event) {
                var windowPosition = getPosition(event);
                var pickedObject = scene.pick(windowPosition);
                var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                var location = tool.cartesianToCoords(ellipsoid, cartesian);
                endLocation = location;
                var searchUrl = "http://restapi.amap.com/v3/geocode/regeo?output=json&location="+ location.longitude +"," + location.latitude +"&key=102a6884c29164d01d8087aeaf795cc1&radius=1000&extensions=all";
                $.ajax({
                    type: "get",
                    async: false,
                    url: searchUrl,
                    success: function (json) {
                        $("#endPointInfo").html(json.regeocode.formatted_address);
                    },
                    error: function () {
                        console.log("fail");
                    }
                });
                if(endPoint) {
                    endPoint.position = cartesian;
                }else {
                    endPoint = viewer.entities.add({
                        name: '点',
                        position: cartesian,
                        point: {
                            color: Cesium.Color.RED,
                            pixelSize: 10,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 1
                        }
                    });
                }
                if (!that.endPointHandler.isDestroyed()) {
                    that.endPointHandler.destroy();
                }
            },Cesium.ScreenSpaceEventType.LEFT_DOWN);
        });

        /*步行路径规划*/
        $("#walkRoutePlan").click(function() {
            $("#routePlanDescription").html("");
            for(var i=0;i< routeCollection.length;i++ ) {
                viewer.entities.remove(routeCollection[i]);
            }
            routeCollection = [];
            if(endLocation && startLocation) {
                var searchUrl = "http://restapi.amap.com/v3/direction/walking?key=102a6884c29164d01d8087aeaf795cc1&origin="+ startLocation.longitude +"," + startLocation.latitude +
                    "&destination="+ endLocation.longitude +"," + endLocation.latitude ;
                $.ajax({
                    type: "get",
                    async: false,
                    url: searchUrl,
                    success: function (json) {
                        console.log(json);
                        if(json.count ==1 ){
                            $("#routePlanDescription").append("" +
                                "距离：<span style='margin:3px;text-align: center'>" + json.route.paths[0].distance +"米</span><br>" +
                                "预计步行时间：<span style='margin:3px;text-align: center'>" + json.route.paths[0].duration +"秒</span><br>"
                            );
                            var stepArr = json.route.paths[0].steps;
                            console.log(stepArr);
                            for(var i=0;i<stepArr.length;i++) {
                                $("#routePlanDescription").append("" +
                                    "step"+ (i+1) +"：<span style='margin:3px;text-align: center'>" + stepArr[i].instruction + "</span><br>");
                                var lnglatArr = stepArr[i].polyline.split(";");
                                var locationArr = [];
                                for(var j=0; j<lnglatArr.length; j++) {
                                    var lng = lnglatArr[j].split(",")[0];
                                    var lat = lnglatArr[j].split(",")[1];
                                    var object = {
                                        longitude: lng,
                                        latitude: lat
                                    };
                                    locationArr.push(object);
                                }
                                console.log(locationArr);
                                generateRoute(locationArr);
                            }
                        }else {
                            alert("步行无法到达或者距离太远，请选择其他方式！");
                        }
                    },
                    error: function () {
                        console.log("fail");
                    }
                });
            }else {
                alert("请选取起始点和终点");
                return;
            }
        });

        /*骑行路径规划*/
        $("#driveRoutePlan").click(function() {
            $("#routePlanDescription").html("");
            for(var i=0;i< routeCollection.length;i++ ) {
                viewer.entities.remove(routeCollection[i]);
            }
            routeCollection = [];
            if(endLocation && startLocation) {
                var searchUrl = "http://restapi.amap.com/v3/direction/driving?key=102a6884c29164d01d8087aeaf795cc1&origin="+ startLocation.longitude +"," + startLocation.latitude +
                    "&destination="+ endLocation.longitude +"," + endLocation.latitude ;
                $.ajax({
                    type: "get",
                    async: false,
                    url: searchUrl,
                    success: function (json) {
                        console.log(json);
                        if(json.count ==1 ){
                            $("#routePlanDescription").append("" +
                                "距离：<span style='margin:3px;text-align: center'>" + json.route.paths[0].distance +"米</span><br>" +
                                "预计骑行时间：<span style='margin:3px;text-align: center'>" + json.route.paths[0].duration +"秒</span><br>"
                            );
                            var stepArr = json.route.paths[0].steps;
                            console.log(stepArr);
                            for(var i=0;i<stepArr.length;i++) {
                                $("#routePlanDescription").append("" +
                                    "step"+ (i+1) +"：<span style='margin:3px;text-align: center'>" + stepArr[i].instruction + "</span><br>");
                                var lnglatArr = stepArr[i].polyline.split(";");
                                var locationArr = [];
                                for(var j=0; j<lnglatArr.length; j++) {
                                    var lng = lnglatArr[j].split(",")[0];
                                    var lat = lnglatArr[j].split(",")[1];
                                    var object = {
                                        longitude: lng,
                                        latitude: lat
                                    };
                                    locationArr.push(object);
                                }
                                console.log(locationArr);
                                generateRoute(locationArr);
                            }
                        }
                    },
                    error: function () {
                        console.log("fail");
                    }
                });
            }else {
                alert("请选取起始点和终点");
                return;
            }
        });

        /*打开定位*/
        $("#openLocation").click(function() {

            that.locationHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            $("#description").html("<div>" +
                "当前位置信息：<span id='locationInfo' style='margin:3px;text-align: center'></span><br>" +
                "经度：<span id='lngLoc' style='margin:3px;text-align: center'></span><br>" +
                "纬度：<span id='latLoc' style='margin:3px;text-align: center'></span><br>" +
                "时刻：<span id='timeLoc' style='margin:3px;text-align: center'></span><br>" +
                "实时天气：<span id='weatherLoc' style='margin:3px;text-align: center'></span><br>" +
                "实时气温：<span id='temperatureLoc' style='margin:3px;text-align: center'></span><br>" +
                "风向：<span id='windDirectionLoc' style='margin:3px;text-align: center'></span><br>" +
                "风力：<span id='windPowerLoc' style='margin:3px;text-align: center'></span><br>" +
                "空气湿度：<span id='humidityLoc' style='margin:3px;text-align: center'></span><br>" +
                "实时天气发布时间：<span id='reportTimeLoc' style='margin:3px;text-align: center'></span><br>" +
                "</div>");
            console.log("打开定位");

            that.locationHandler.setInputAction(function (event) {
                var windowPosition = getPosition(event);
                var pickedObject = scene.pick(windowPosition);
                var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                var location = tool.cartesianToCoords(ellipsoid, cartesian);
                $("#lngLoc").html(location.longitude);
                $("#latLoc").html(location.latitude);
                $("#timeLoc").html(new Date());
                var searchUrl = "http://restapi.amap.com/v3/geocode/regeo?output=json&location="+ location.longitude +"," + location.latitude +"&key=102a6884c29164d01d8087aeaf795cc1&radius=1000&extensions=all";
                $.ajax({
                    type: "get",
                    async: false,
                    url: searchUrl,
                    success: function (json) {
                        $("#locationInfo").html(json.regeocode.formatted_address);
                        //获取城市编码以方便查询天气状况
                        var adcode = json.regeocode.addressComponent.adcode;
                        searchWeather(adcode);
                    },
                    error: function () {
                        console.log("fail");
                    }
                });
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        });

        /*关闭定位*/
        $("#closeLocation").click(function() {
            if (!that.locationHandler.isDestroyed()) {
                that.locationHandler.destroy();
            }
            $("#descriptionPanel").hide();
            console.log("关闭定位");
        });
    }

    function generateRoute(touristLocationArr) {
        for(var i=0; i<touristLocationArr.length - 1; i++) {
            var lng1 = parseFloat(touristLocationArr[i].longitude).toFixed(7);
            var lat1 = parseFloat(touristLocationArr[i].latitude).toFixed(7);
            var lng2 = parseFloat(touristLocationArr[i+1].longitude).toFixed(7);
            var lat2 = parseFloat(touristLocationArr[i+1].latitude).toFixed(7);
            var temp = viewer.entities.add({
                name: '线',
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArray([lng1, lat1, lng2, lat2]),
                    width: 2,
                    material: Cesium.Color.ORANGE.withAlpha(0.5)
                }
            });
            routeCollection.push(temp);
        }
    }

    function searchWeather(adcode) {
        var searchUrl = "http://restapi.amap.com/v3/weather/weatherInfo?city=" + adcode +"&key=102a6884c29164d01d8087aeaf795cc1";
        $.ajax({
            type: "get",
            async: false,
            url: searchUrl,
            success: function (json) {
                $("#weatherLoc").html(json.lives[0].weather);
                $("#temperatureLoc").html(json.lives[0].temperature + "℃");
                $("#windDirectionLoc").html(json.lives[0].winddirection);
                $("#windPowerLoc").html(json.lives[0].windpower);
                $("#humidityLoc").html(json.lives[0].humidity);
                $("#reportTimeLoc").html(json.lives[0].reporttime);
                $("#descriptionPanel").show();
            },
            error: function () {
                console.log("fail");
            }
        });
    }

    locationManager.prototype.destroy = function (viewer) {
        if (!this.locationHandler.isDestroyed()) {
            this.locationHandler.destroy();
            $("#descriptionPanel").hide();
        }
    };
    return locationManager;
});