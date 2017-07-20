/**
 * Created by wangdunwen on 2017/3/15.
 */
define(['utils/Tools',
    'utils/DrawPoint'], function (Tools, DrawPoint) {

    var tool = new Tools();
    var drawPoint = new DrawPoint();
    var armyTemp = new Array();

    var polylinePlotting = function (viewer, lineArray, row, plotObject) {

        var pointarr = new Array();
        var count = 0;
        var scene = viewer.scene;
        var pointer = 0;
        var entity, currentPointer;
        var ellipsoid = scene.globe.ellipsoid;
        this.polylinePlottingHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        this.polylinePlottingHandler.setInputAction(function (event) {
            var windowPosition = getPosition(event);
            var pickedObject = scene.pick(windowPosition);
            if (Cesium.defined(pickedObject)) {     //如果已经存在该Point则改变线位置属性
                entity = pickedObject.id;
                if (entity.name !== "端点") {
                    return;
                }
                if (entity.point !== undefined && entity !== undefined) {
                    var arrayPoint = pointInArray(lineArray, entity.id);
                    if (arrayPoint.isExist === true) {
                        currentPointer = {"row": arrayPoint.row, "col": arrayPoint.col};
                    }
                    entity.point.pixelSize = 16;
                }
            } else {
                //画顶点及对应线段
                var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                //pointer==0时画第一个点
                if (cartesian && pointer === 0) {

                    var point = drawPoint.drawpoint(viewer, ellipsoid, cartesian, "顶点");

                    lineArray[row][0] = point;
                    pointer++;
                    pointarr[count] = Cesium.Math.toDegrees(ellipsoid.cartesianToCartographic(cartesian).longitude).toFixed(8);
                    count++;
                    pointarr[count] = Cesium.Math.toDegrees(ellipsoid.cartesianToCartographic(cartesian).latitude).toFixed(8);
                    count++;
                }
                else if (cartesian && pointer > 0) {
                    var startPos = null;
                    var endPos = null;

                    startPos = tool.cartesianToCoords(ellipsoid, lineArray[row][pointer - 1].entity.position._value);
                    endPos = tool.cartesianToCoords(ellipsoid, cartesian);
                    lineArray[row][pointer] = drawLine(viewer, startPos, endPos);
                    pointer++;
                    lineArray[row][pointer] = drawPoint.drawpoint(viewer, ellipsoid, cartesian, "顶点");
                    pointer++;
                    pointarr[count] = Cesium.Math.toDegrees(ellipsoid.cartesianToCartographic(cartesian).longitude).toFixed(8);
                    count++;
                    pointarr[count] = Cesium.Math.toDegrees(ellipsoid.cartesianToCartographic(cartesian).latitude).toFixed(8);
                    count++;
                    armyTemp = pointarr;
                    plotObject.entity.polyline.push(armyTemp);
                }
            }
            isLeftDown = true;
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    };


    var drawLine = function (viewer, startPos, endPos) {
        var redLine = viewer.entities.add({
            name: '线',
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([startPos.longitude, startPos.latitude, endPos.longitude, endPos.latitude]),
                width: 2,
                material: Cesium.Color.RED.withAlpha(0.5)
            }
        });
        return {"entity": redLine, "type": "polyline"};
    };

    polylinePlotting.prototype.destroy = function (viewer) {
        if (!this.polylinePlottingHandler.isDestroyed()) {
            this.polylinePlottingHandler.destroy();
        }
    };

    function pointInArray(array, id) {
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[i].length; j++) {
                if (array[i][j].entity.id === id) {
                    return {"isExist": true, "row": i, "col": j};
                }
            }
        }
        return {"isExist": false, "row": -1, "col": -1};
    }

    return polylinePlotting;
});