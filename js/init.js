/**
 * Created by wangdunwen on 16/11/8.
 */
window.viewer = new Cesium.Viewer('container', {
    animation: true,
    baseLayerPicker: false,
    geocoder: false,
    scene3DOnle: false,
    sceneModePicker: true,
    selectionIndicator: false,
    infoBox: true,
    homeButton: false,
    timeline: true,
    navigationHelpButton: false,
    fullscreenButton: false,
    imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: './data/SatelliteMap'
    })
});

viewer.scene.debugShowFramesPerSecond = true;

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(120.16, 31.71, 23000000)
});

window.isTourist = false;
window.touristLocationArr = [];

/*关闭加载界面*/
// $("#loadingIndicator").css("display","none");
setTimeout(function() {
    $("#loadingIndicator").css("display","none");
}, 2000);

$("#htmlContainer").load("html/container.html");

var btnId = "";
/*判断当前鼠标点的是第几个按钮*/

/*高分数据*/
$("#layer").click(function () {
    destroyPlotHandler();
    $("#descriptionPanel").hide();
    btnClear();
    if (btnId !== "layer") {
        btnId = "layer";
        $("#layer").css("color", "#66ccff");
        $("#layer").css("background", "url(resources/images/minus-blue.png) no-repeat 90%");
        $("#layer").unbind("mouseenter mouseleave");
        $("#layerPanel").show();
    } else {
        btnId = "";
        $("#layerPanel").hide();
    }
});

/*气象数据*/
$("#cloud").click(function () {
    destroyPlotHandler();
    $("#descriptionPanel").hide();
    btnClear();
    if (btnId !== "cloud") {
        btnId = "cloud";
        $("#cloud").css("color", "#66ccff");
        $("#cloud").css("background", "url(resources/images/minus-blue.png) no-repeat 90%");
        $("#cloud").unbind("mouseenter mouseleave");
        $("#cloudPanel").show();
    } else {
        btnId = "";
        $("#cloudPanel").hide();
    }
});

/*卫星定位*/
$("#location").click(function () {
    destroyPlotHandler();
    $("#descriptionPanel").hide();
    btnClear();
    if (btnId !== "location") {
        btnId = "location";
        $("#location").css("color", "#66ccff");
        $("#location").css("background", "url(resources/images/minus-blue.png) no-repeat 90%");
        $("#location").unbind("mouseenter mouseleave");
        $("#locationPanel").show();
    } else {
        btnId = "";
        $("#locationPanel").hide();
    }
});

/*数据标绘*/
$("#plot").click(function () {
    destroyPlotHandler();
    $("#descriptionPanel").hide();
    btnClear();
    if (btnId !== "plot") {
        btnId = "plot";
        $("#plot").css("color", "#66ccff");
        $("#plot").css("background", "url(resources/images/minus-blue.png) no-repeat 90%");
        $("#plot").unbind("mouseenter mouseleave");
        $("#plotPanel").show();
    } else {
        btnId = "";
        $("#plotPanel").hide();
    }
});

/*视角信息*/
$("#view").click(function () {
    destroyPlotHandler();
    $("#descriptionPanel").hide();
    btnClear();
    if (btnId !== "view") {
        btnId = "view";
        $("#view").css("color", "#66ccff");
        $("#view").css("background", "url(resources/images/minus-blue.png) no-repeat 90%");
        $("#view").unbind("mouseenter mouseleave");
        $("#viewPanel").show();
    } else {
        btnId = "";
        $("#viewPanel").hide();
    }
});

function btnClear() {
    /*var btnArray = ["layer", "cloud", "location", "plot", "view"];*/

    /*关闭所有面板*/
    $("#layerPanel").hide();
    $("#cloudPanel").hide();
    $("#locationPanel").hide();
    $("#plotPanel").hide();
    $("#viewPanel").hide();

    /*layer*/
    $("#layer").css("color", "white");
    $("#layer").css("background", "url(resources/images/plus-white.png) no-repeat 90%");
    $("#layer").hover(function () {
        $("#layer").css("background", "url(resources/images/plus-blue.png) no-repeat 90%");
        $("#layer").css("color", "#66ccff");
    }, function () {
        $("#layer").css("background", "url(resources/images/plus-white.png) no-repeat 90%");
        $("#layer").css("color", "white");
    });

    /*cloud*/
    $("#cloud").css("color", "white");
    $("#cloud").css("background", "url(resources/images/plus-white.png) no-repeat 90%");
    $("#cloud").hover(function () {
        $("#cloud").css("background", "url(resources/images/plus-blue.png) no-repeat 90%");
        $("#cloud").css("color", "#66ccff");
    }, function () {
        $("#cloud").css("background", "url(resources/images/plus-white.png) no-repeat 90%");
        $("#cloud").css("color", "white");
    });

    /*location*/
    $("#location").css("color", "white");
    $("#location").css("background", "url(resources/images/plus-white.png) no-repeat 90%");
    $("#location").hover(function () {
        $("#location").css("background", "url(resources/images/plus-blue.png) no-repeat 90%");
        $("#location").css("color", "#66ccff");
    }, function () {
        $("#location").css("background", "url(resources/images/plus-white.png) no-repeat 90%");
        $("#location").css("color", "white");
    });

    /*plot*/
    $("#plot").css("color", "white");
    $("#plot").css("background", "url(resources/images/plus-white.png) no-repeat 90%");
    $("#plot").hover(function () {
        $("#plot").css("background", "url(resources/images/plus-blue.png) no-repeat 90%");
        $("#plot").css("color", "#66ccff");
    }, function () {
        $("#plot").css("background", "url(resources/images/plus-white.png) no-repeat 90%");
        $("#plot").css("color", "white");
    });

    /*view*/
    $("#view").css("color", "white");
    $("#view").css("background", "url(resources/images/plus-white.png) no-repeat 90%");
    $("#view").hover(function () {
        $("#view").css("background", "url(resources/images/plus-blue.png) no-repeat 90%");
        $("#view").css("color", "#66ccff");
    }, function () {
        $("#view").css("background", "url(resources/images/plus-white.png) no-repeat 90%");
        $("#view").css("color", "white");
    });
}

/*复位*/
$("#img_reset").click(function () {
    $("#img_reset").attr("src", "resources/images/ajax-loader.gif");

    setTimeout(function () {
        $("#img_reset").attr("src", "resources/images/planet_earth.png");
    }, 3000);

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

    destroyPlotHandler();

    viewer.scene.screenSpaceCameraController.enableZoom = true;
    viewer.entities.removeAll();
    viewer.dataSources.removeAll();
    if (layerCollection.contains(layer1)) {
        layerCollection.remove(layer1, false);
    }
    if (layerCollection.contains(layer2)) {
        layerCollection.remove(layer2, false);
    }
});

/*登录界面*/
$("#personLogin").html(sessionStorage.getItem("username"));

$("#ensureToLogout").click(function () {
    /*清空登陆缓存*/
    sessionStorage.removeItem("username");

    /*跳转至登陆页*/
    window.location.href = "login.html";

    $("#myModal").modal('hide');

});

window.layer1 = "";
window.layer2 = "";
window.layerCollection;
layerCollection = viewer.scene.imageryLayers;
/*浏览器定位*/
$("#browserLocation").click(function() {
    console.log("浏览器定位开启！");
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition, errHandle);
    }else{
        alert("浏览器定位失败，请检查设备或者网络是否连接！");
    }
    function errHandle(e) {
        console.log(e);
    }
    function showPosition(position) {
        layerCollection = viewer.scene.imageryLayers;
        var currentLongtitude = position.coords.longitude;
        var currentLatitude = position.coords.latitude;
        console.log("当前坐标：" + position.coords.latitude + ";" + position.coords.longitude);
        //视角切换到当前位置
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(parseFloat(currentLongtitude), parseFloat(currentLatitude), 2000),
            duration: 5.0
        });
        var point = viewer.entities.add({
            name: '点',
            position: Cesium.Cartesian3.fromDegrees(parseFloat(currentLongtitude), parseFloat(currentLatitude)),
            point: {
                color: Cesium.Color.RED,
                pixelSize: 4,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1
            }
        });
        var textEntity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(parseFloat(currentLongtitude), parseFloat(currentLatitude)),
            name :"label",
            label: {
                text: "当前位置",
                font : '24px Helvetica',
                fillColor :  Cesium.Color.SKYBLUE,
                outlineColor :  Cesium.Color.BLACK,
                outlineWidth : 2,
                style :  Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -9)
                //translucencyByDistance : new Cesium.NearFarScalar(1.5e5, 1.0, 1.5e7, 0.0)
            }
        });
        viewer.scene.screenSpaceCameraController.enableZoom = true;
        if (layerCollection.contains(layer1)) {
            layerCollection.raiseToTop(layer1);
        } else {
            layer1 = layerCollection.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                layer: "tdtBasicLayer",
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
                url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                show: false
            }));
        }
    }
});

/*初始化socket.io*/
window.socket = "";