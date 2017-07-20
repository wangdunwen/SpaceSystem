/**
 * Created by Wangdunwen on 2017/3/8.
 */
define([
    'utils/Tools'],function(tools) {
    var tool = new tools();
    var rectanglePlot = function (id, rectangleArray, plotObject) {
        var pointer = rectangleArray.length;
        var pointData = {
            type: "rectangle",
            word:"",
            name: "",
            detail: "",
            value: []
        }
        //判断当前是否进入标绘状态
        var flag = true;
        var isLeftDown = false;
        var id = id;
        var firstCartesian;
        var firstLngLat;
        var secondCartesian;
        var secondLngLat;
        var west;
        var south;
        var east;
        var north;
        var scene = viewer.scene;
        this.rectanglHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        var ellipsoid = scene.globe.ellipsoid;

        this.rectanglHandler.setInputAction(function (event) {
            var windowPosition = getPosition(event);
            firstCartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
            firstLngLat = tool.cartesianToCoords(ellipsoid, firstCartesian)
            isLeftDown = true;
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        this.rectanglHandler.setInputAction(function (event) {
            if (flag && isLeftDown) {
                scene.screenSpaceCameraController.enableRotate = false;
                var windowPosition = event.endPosition;
                secondCartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                secondLngLat = tool.cartesianToCoords(ellipsoid, secondCartesian);
                if (firstLngLat.longitude < secondLngLat.longitude) {
                    west = firstLngLat.longitude;
                    east = secondLngLat.longitude;
                } else {
                    west = secondLngLat.longitude;
                    east = firstLngLat.longitude;
                }
                if (firstLngLat.latitude < secondLngLat.latitude) {
                    south = firstLngLat.latitude;
                    north = secondLngLat.latitude;
                } else {
                    south = secondLngLat.latitude;
                    north = firstLngLat.latitude;
                }
                viewer.entities.removeById(id);

                var rec = drawRectangle(id, west, south, east, north);
                rectangleArray[pointer] = rec;
                pointer++;

                pointData.value[0] = (west + east) / 2;
                pointData.value[1] = (north + south) / 2;
                pointData.value[2] = west;
                pointData.value[3] = south;
                pointData.value[4] = east;
                pointData.value[5] = north;

                plotObject.entity.rectangle.push(pointData);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        this.rectanglHandler.setInputAction(function () {
            flag = false;
            scene.screenSpaceCameraController.enableRotate = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

    };
    rectanglePlot.prototype.destroy = function (viewer) {
        if (!this.rectanglHandler.isDestroyed()) {
            this.rectanglHandler.destroy();
        }
    };
    var drawRectangle = function (id, west, south, east, north) {
        var rectangle = viewer.entities.add({
            id: id,
            name: 'rectangle',
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(west, south, east, north),
                material: Cesium.Color.RED.withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.BLACK
            }
        });

        return rectangle;
    }

    return rectanglePlot;
})