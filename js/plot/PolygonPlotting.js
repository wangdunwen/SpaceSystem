/**
 * Created by WangDunWen on 2017/3/18.
 */
define([
    'utils/DrawPoint'
], function (DrawPoint) {

    var armyTemp = new Array();
    var DrawPolygon = function (viewer, polygonArray, plotObject) {
        var drawPoint = new DrawPoint();
        var pointarr = new Array();
        var count = 0;
        var scene = viewer.scene;
        //当前的polygonArray指针
        var currentPointer = polygonArray.length;
        polygonArray[currentPointer] = {
            "points": [],
            "polygon": null,
            "hierarchy": []
        };
        var hierarchyArray = polygonArray[currentPointer].hierarchy;
        //指向当前Polygon的hierarchy
        var pointer = 0;
        //指向当前Polygon的Points
        var entityPointer = 0;
        var entity, currentPoint;

        this.polygonPlottingHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        var ellipsoid = scene.globe.ellipsoid;
        this.polygonPlottingHandler.setInputAction(function (event) {
            var windowPosition = getPosition(event);
            var pickedObject = scene.pick(windowPosition);
            var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
            if (Cesium.defined(pickedObject)) {
                entity = pickedObject.id;
                if (entity.point !== undefined && entity !== undefined) {
                    entity.point.pixelSize = 16;
                    if (entity.name !== "顶点") {
                        return;
                    }
                    var arrayPoint = pointInPolygon(polygonArray, entity.id);
                    if (arrayPoint.isExist === true) {
                        currentPoint = {
                            "row": arrayPoint.row,
                            "col": arrayPoint.col
                        };
                    }
                    console.log(arrayPoint, "-", polygonArray);
                }
            } else {
                var position = drawPoint.drawpoint(viewer, ellipsoid, cartesian, "顶点");
                polygonArray[currentPointer].points[entityPointer] = position.entity;
                entityPointer++;
                hierarchyArray[pointer] = position.longitude;
                pointer++;
                hierarchyArray[pointer] = position.latitude;
                pointer++;
                pointarr[count] = Cesium.Math.toDegrees(ellipsoid.cartesianToCartographic(cartesian).longitude).toFixed(8);
                count++;
                pointarr[count] = Cesium.Math.toDegrees(ellipsoid.cartesianToCartographic(cartesian).latitude).toFixed(8);
                count++;
                armyTemp = pointarr;

                if (hierarchyArray.length === 6) {
                    polygonArray[currentPointer].polygon = drawPolygon(viewer, hierarchyArray);
                    plotObject.entity.polygon.push(armyTemp);
                } else if (hierarchyArray.length < 6) {
                    polygonArray[currentPointer].polygon = null;
                } else {
                    var id = polygonArray[currentPointer].polygon.id;
                    viewer.entities.removeById(id);
                    polygonArray[currentPointer].polygon = drawPolygon(viewer, hierarchyArray);
                    armyTemp = pointarr;
                    plotObject.entity.polygon.push(armyTemp);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    };

    DrawPolygon.prototype.destroy = function (viewer) {
        var scene = viewer.scene;
        scene.screenSpaceCameraController.enableRotate = true;
        scene.screenSpaceCameraController.enableInputs = true;
        if (!this.polygonPlottingHandler.isDestroyed()) {
            this.polygonPlottingHandler.destroy();
        }
    };


    var drawPolygon = function (viewer, pointArray) {
        var polygon = viewer.entities.add({
            name: '多边形',
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(pointArray),
                material: Cesium.Color.RED.withAlpha(0.5),
                outlineColor: Cesium.Color.BLACK,
                outline: true
            }
        });
        return polygon;
    };

    function pointInPolygon(polygonArray, id) {
        for (var i = 0; i < polygonArray.length; i++) {
            for (var j = 0; j < polygonArray[i].points.length; j++) {
                if (polygonArray[i].points[j].id === id) {
                    return {"isExist": true, "row": i, "col": j};
                }
            }
        }
        return {"isExist": false, "row": -1, "col": -1};
    }

    return DrawPolygon;
});
