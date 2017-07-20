/**
 * Created by wangdunwen on 2017/3/15.
 */
define(['../utils/Tools'],function(Tools) {
    var tool = new Tools();
    var pointPlotting = function(plotObject, viewer, pointArray) {
        var pointer = pointArray.length;
        var entity = pointArray[pointer];
        var isLeftDown = false;
        var scene = viewer.scene;
        this.pointHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        var ellipsoid = scene.globe.ellipsoid;
        this.pointHandler.setInputAction(function (event) {
            var windowPosition = getPosition(event);
            var pickedObject = scene.pick(windowPosition);
            //如果已经存在该Point则改变属性
            if (Cesium.defined(pickedObject)) {
                entity = pickedObject.id;
                if (entity.name !== "点") {
                    return;
                }
            } else {
                var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);

                var point = viewer.entities.add({
                    name: '点',
                    position: cartesian,
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 4,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 1
                    }
                });
                if (cartesian === null) {
                    return;
                }
                if(isTourist == true) {
                    touristLocationArr.push(tool.cartesianToCoords(ellipsoid, cartesian));
                    console.log(touristLocationArr);
                }
                $("#descriptionForEntityDiv").show();
                $("#addDescription").unbind("click").click(function() {
                    point.description = $("#descriptionForEntity").val();
                    $("#descriptionForEntityDiv").hide();
                });
                plotObject.entity.point.push(cartesian);

                pointArray[pointer] = point;
                pointer++;
            }
            isLeftDown = true;
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    };

    pointPlotting.prototype.destroy = function(viewer) {
        if (!this.pointHandler.isDestroyed()) {
            this.pointHandler.destroy();
        }
    };

    return pointPlotting;
})