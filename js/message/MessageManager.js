/**
 * Created by wangdunwen on 2017/1/16.
 */
define(["./Documentation",
    "./EmergencyRescue",
    "./WarningPublish",
        '../utils/Tools' ],
    function (Documentation,
              EmergencyRescue,
              WarningPublish,
              tool) {
    var tool = new tool();
    var documentation;
    var emergencyRescue;
    var warningPublish;
    var mateIdArr = [];

    var messageManager = function () {

        /*多媒体地球*/
        $("#mediaGlobe").click(function() {
            if( $("#mediaGlobePanel").is(":hidden") ) {
                $("#mediaGlobePanel").show();
            }else {
                $("#mediaGlobePanel").hide();
            }
            var sphere;
            var videoElement = document.getElementById('trailer');
            $("#trailer").html('<source src="http://cesiumjs.org/videos/Sandcastle/big-buck-bunny_trailer.webm" type="video/webm">' +
                '<source src="http://cesiumjs.org/videos/Sandcastle/big-buck-bunny_trailer.mp4" type="video/mp4">' +
                '<source src="http://cesiumjs.org/videos/Sandcastle/big-buck-bunny_trailer.mov" type="video/quicktime">');
            $("#openMediaGlobe").click(function() {

                sphere = viewer.entities.add({
                    position : Cesium.Cartesian3.fromDegrees(-79, 39, 1200000000),
                    ellipsoid : {
                        radii : new Cesium.Cartesian3(1000, 1000, 1000),
                        material : videoElement
                    }
                });
                viewer.trackedEntity = sphere;

                if(videoElement.style.display === 'none'){
                    videoElement.style.display = '';
                    return;
                }
            });

            $("#closeMediaGlobe").click(function() {
                $("#trailer").html("");
                $("#trailer").trigger("pause");
                videoElement.style.display = 'none';
                viewer.entities.remove(sphere);
            });
        });


        /*文本信息*/
        $("#textInfo").click(function() {
            if( $("#infoPanel").is(":hidden") ) {
                $("#infoPanel").show();
                documentation = new Documentation();
            }else {
                $("#infoPanel").hide();
            }
            console.log("文本");
        });

        /*救援信息*/
        $("#helpInfo").click(function() {
            if( $("#helpPanel").is(":hidden") ) {
                $("#helpPanel").show();
                emergencyRescue = new EmergencyRescue();
            }else {
                $("#helpPanel").hide();
            }
        });

        /*警报发布*/
        $("#alarmPublish").click(function() {
            if( $("#alarmPanel").is(":hidden") ) {
                $("#alarmPanel").show();
                warningPublish = new WarningPublish();
            }else {
                $("#alarmPanel").hide();
            }
        });

        $("#alarmType").click(function() {
            if( $("#warnType").is(":hidden") ) {
                $("#warnType").show();
            }else {
                $("#warnType").hide();
            }
        });

        $("#alarmLevel").click(function() {
            if( $("#warnLevel").is(":hidden") ) {
                $("#warnLevel").show();
            }else {
                $("#warnLevel").hide();
            }
        });

        /*旅游日记功能*/
        $("#touristDaily").click(function() {
            var distance = 0;
            var unit = "";
            if( $("#touristPanel").is(":hidden") ) {
                isTourist = true;
                touristLocationArr = [];
                $("#touristPanel").show();
                /*加载全球矢量地图*/
                if (layerCollection.contains(layer1)) {
                    layerCollection.raiseToTop(layer1);
                } else {
                    layer1 = layerCollection.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                        url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                        layer: "tdtVecBasicLayer",
                        style: "default",
                        format: "image/jpeg",
                        tileMatrixSetID: "GoogleMapsCompatible",
                        show: false
                    }));
                }
                if (layerCollection.contains(layer2)) {
                    layerCollection.raiseToTop(layer2);
                } else {
                    layer2 = layerCollection.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                        url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
                        layer: "tdtAnnoLayer",
                        style: "default",
                        format: "image/jpeg",
                        tileMatrixSetID: "GoogleMapsCompatible"
                    }));
                }
                /*生成旅游路线*/
                $("#generateRoute").click(function() {
                    for(var i=0; i<touristLocationArr.length - 1; i++) {
                        var lng1 = parseFloat(touristLocationArr[i].longitude).toFixed(2);
                        var lat1 = parseFloat(touristLocationArr[i].latitude).toFixed(2);
                        var lng2 = parseFloat(touristLocationArr[i+1].longitude).toFixed(2);
                        var lat2 = parseFloat(touristLocationArr[i+1].latitude).toFixed(2);
                        distance +=
                            tool.getDistance(touristLocationArr[i].longitude, touristLocationArr[i].latitude, touristLocationArr[i+1].longitude, touristLocationArr[i+1].latitude)
                        viewer.entities.add({
                            name: '线',
                            polyline: {
                                positions: Cesium.Cartesian3.fromDegreesArray([lng1, lat1, lng2, lat2]),
                                width: 2,
                                material: Cesium.Color.RED.withAlpha(0.5)
                            }
                        });
                    }
                    $("#distanceRoutePanel").show();
                    if (distance <= 1 && distance >0) {
                        distance *= 1000;
                        distance = distance.toFixed(2);
                        unit = "米";
                    } else if (distance > 1 && distance <= 1000){
                        distance = distance.toFixed(2);
                        unit = "公里";
                    } else if (distance > 1000) {
                        distance = Math.round(distance);
                        unit = "公里";
                    }
                    $("#distanceRouteDiv").html("我已经走过了 " + distance + " " + unit);
                    distance = 0;
                    console.log(distance);
                });
            }else {
                $("#distanceRoutePanel").hide();
                $("#touristPanel").hide();
            }
        });

        $("#matePathDiv").click(function() {
            if( $("#matePathPanel").is(":hidden") ) {
                $("#matePathPanel").show();
            }else {
                $("#matePathPanel").hide();
            }
            $("#openMatePath").unbind("click").click(function() {

                console.log("打开轨迹模拟");
                viewer.scene.screenSpaceCameraController.enableZoom = true;
                getMatePathData("./data/vector/MatePath.json");
                // 显示时间轴
                viewer.animation.container.style.display = "block";
                viewer.timeline.container.style.display = "block";
                viewer.scene.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(66.3434, 28.4388, 12000000),
                    orientation: {
                        heading: 0.0,
                        pitch: -Math.PI * 0.5,
                        roll: 0.0
                    },
                    duration: 3.0,
                    endTransform: Cesium.Matrix4.IDENTITY
                });
            });
            $("#closeMatePath").unbind("click").click(function() {
                console.log("关闭轨迹模拟");
                removeMatePathOverlay();
                // 隐藏时间轴
                viewer.animation.container.style.display = "none";
                viewer.timeline.container.style.display = "none";
                viewer.scene.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(120.16, 31.71, 23000000),
                    orientation: {
                        heading: 0.0,
                        pitch: -Math.PI * 0.5,
                        roll: 0.0
                    },
                    duration: 3.0,
                    endTransform: Cesium.Matrix4.IDENTITY
                });
            });
        });

        /**
         * 读取队友轨迹JSON文件数据，根据文件内容生成对应的队友轨迹图层
         * @param url
         */
        var getMatePathData = function (url) {
            console.log(url);
            $.getJSON(url, function (result) {
                var contacts = result.contact;
                for (var i = 0; i < contacts.length; i++) {
                    var id = contacts[i].id;
                    mateIdArr.push(id);
                    var latlog = contacts[i].coordinate;
                    var imgUrl = contacts[i].imageUrl;
                    genMatePathOverlay(id, latlog, imgUrl);
                }
            });

            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(50, 40),
                duration: 1.0
            });
        }

        // 设置起始、终止时间
        var start = Cesium.JulianDate.fromDate(new Date(2016, 10, 19, 16));
        var total_time = 360;
        var stop = Cesium.JulianDate.addSeconds(start, total_time, new Cesium.JulianDate());

        /*
         *根据队友轨迹数据生成对应队友轨迹图层
         * @param id
         * @param location
         * @param imgUrl
         */
        function genMatePathOverlay(id, location, imgUrl) {
            tool.initTimeline(viewer, start, stop, 3);
            var property = new Cesium.SampledPositionProperty();
            for (var i = 0, interval = 0; i < location.length; i++, interval += (total_time / (location.length - 1))) {
                var time = Cesium.JulianDate.addSeconds(start, interval, new Cesium.JulianDate());
                var position = Cesium.Cartesian3.fromDegrees(parseFloat(location[i][0]), parseFloat(location[i][1]), parseFloat(location[i][2]));
                property.addSample(time, position);
            }

            viewer.entities.add({
                id: id,
                availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                    start: start,
                    stop: stop
                })]),
                position: property,
                orientation: new Cesium.VelocityOrientationProperty(property),
                billboard: {
                    image: imgUrl,
                    scale: 0.1,
                },
                path: {
                    resolution: 1,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        glowPower: 0.1,
                        color: Cesium.Color.RED
                    }),
                    width: 10
                }
            });
        }

        /*
         *根据id删除队友图层
         */
        function removeMatePathOverlay() {
            for (var id in mateIdArr) {
                viewer.entities.removeById(mateIdArr[id]);
            }
        }


    }

    return messageManager;
});