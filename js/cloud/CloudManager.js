/**
 * Created by wangdunwen on 2017/1/16.
 */
define(["../data/CloudPointData"],function (CloudPointData) {

    var cloudPointData = new CloudPointData();

    var cloudManager = function () {

        /*模拟云图*/
        $("#simulateCloud").click(function() {
            if( $("#simulateCloudPanel").is(":hidden") ) {
                $("#simulateCloudPanel").show();
            }else {
                $("#simulateCloudPanel").hide();
            }
        });

        var scene = viewer.scene;
        var imageryLayers = scene.imageryLayers;
        var cloudLayer = new Array(19);
        var i = 1;
        var id;
        $('#openSimulateCloud').click(function () {
            if(i>1)
                return;
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(110, 31,20000000)
            });
            window.setTimeout(function () {
                viewer.scene.screenSpaceCameraController.enableZoom = false;
                id = window.setInterval(function () {
                    if (i > 19) {
                        i = 1;
                        window.clearInterval(id);
                        return;
                    }
                    console.log('i = ' + i)
                    cloudLayer[i] = imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
                        url: './data/yuntu/' + i++ + '.png',
                        rectangle: Cesium.Rectangle.fromDegrees(60.0, 0.0, 150.0, 60.0)
                    }));
                }, 200);
            }, 1000)
        })
        $('#closeSimulateCloud').click(function () {
            viewer.scene.screenSpaceCameraController.enableZoom = true;
            window.clearInterval(id);
            i = 1;
            for (var j = 19; j >= 1; j--) {
                imageryLayers.remove(cloudLayer[j]);
            }
        });

        /*在线云图*/
        $("#onlineCloud").click(function() {
            if( $("#onlineCloudPanel").is(":hidden") ) {
                $("#onlineCloudPanel").show();
            }else {
                $("#onlineCloudPanel").hide();
            }
        });

        var imageryLayers = scene.imageryLayers;
        var cloudLayer;

        $('#openOnlineCloud').click(function () {
            $("#onlineCloudDiv").show();
            var cloudPointArr = cloudPointData.getCloudPointData();
            for(var i=0; i<cloudPointArr.length; i++) {
                $("#watchPoint").append('<li><a href="#" class="li_content">'+ cloudPointArr[i].name +'</a></li>');
            }
            $(function() {
                $('#watchPoint').on('click', '.li_content' ,function(){
                    $("#cloudPoint").val($(this).html());
                });
            });
            $("#getOnlineCloud").click(function() {
                var pointId;
                var myDate = new Date();
                var year, month, day, hour, minute, second;
                year = myDate.getFullYear().toString();
                month = myDate.getMonth()+1;
                day = myDate.getDay();
                hour = myDate.getHours();
                minute = "00";
                second = "00";

                if(month < 10) {
                    month = "0" + month.toString();
                }else{
                    month = month.toString();
                }

                if(day < 10) {
                    day = "0" + day.toString();
                }else{
                    day = day.toString();
                }

                if(hour < 10) {
                    hour = "0" +hour.toString();
                }else{
                    hour = hour.toString();
                }

                var time = year + month + day + hour + minute + second;

                for(var i=0; i<cloudPointArr.length; i++) {
                    if(cloudPointArr[i].name == $("#cloudPoint").val()) {
                        pointId = cloudPointArr[i].id;
                    }
                }
                /*首先获取站点坐标*/
                var searchUrl = "http://restapi.amap.com/v3/geocode/geo?address=" + $("#cloudPoint").val() + "&output=JSON&key=102a6884c29164d01d8087aeaf795cc1";
                $.ajax({
                    type: "get",
                    async: false,
                    url: searchUrl,
                    success: function (json) {
                        var location = json.geocodes[0].location;
                        var locArr = location.split(",");
                        var lng = parseFloat(locArr[0]).toFixed(5);
                        var lat = parseFloat(locArr[1]).toFixed(5);
                        //搜索到结果后视角飞向该地点
                        viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(lng, lat, 20000000.0),
                            duration: 5
                        });

                        //转换坐标后获取该站点云图
                        var searchUrl = "http://api.data.cma.cn/api?key=D97B384EAD13B67DDA130D1D2E1AC5F4&data=RADA_REF&staIDs=" + pointId +
                            "&times=" + time;
                        $.ajax({
                            type: "get",
                            async: false,
                            /*dataType: "jsonp",
                            contentType: "application/json;charset=UTF-8",
                            jsonp: "callback",
                            jsonpCallback:"success_jsonpCallback",*/
                            url: searchUrl,
                            success: function (json) {
                                if(json.returnCode == "0") {
                                    cloudLayer = imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
                                        url: json.DS[0].FILE_URL,
                                        rectangle: Cesium.Rectangle.fromDegrees(60.0, 0.0, 150.0, 60.0),
                                        ellipsoid: Cesium.Ellipsoid.fromCartesian3(Cesium.Cartesian3.fromDegrees(lng, lat))
                                    }));
                                }else{
                                    alert("该站点暂无云图数据！");
                                }
                            },
                            error: function (e) {
                                console.log("fail to get cloud");
                            }
                        });
                        /*$.getJSON(searchUrl + "&jsoncallback=?",
                            function (data) {
                                console.log(data);
                            }
                        );*/
                    },
                    error: function () {
                        console.log("fail to get location");
                    }
                });
            });

        });

        $('#closeOnlineCloud').click(function () {
            console.log("关闭在线云图");
            $("#onlineCloudDiv").hide();
        });
    }
    return cloudManager;
});