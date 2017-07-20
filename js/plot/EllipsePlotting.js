/**
 * Created by WangDunWen on 2017/3/8.
 */
define(function () {
    
    var ellipsePlotting = function (id, ellipseArray, plotObject) {
        var pointer = ellipseArray.length;
        var pointData = {
            type: "ellipse",
            word:"",
            name: "",
            detail: "",
            center: null,
            value: []
        }
        // 判断当前是否进入标绘状态
        var flag = true;
        var id = id;
        var isLeftDown = false;
        var firstCartesian;
        var secondCartesian;
        var semiMajorAxis;//长半轴
        var semiMinorAxis;//短半轴
        var scene = viewer.scene;
        var centerPosition;
        var entity;
        this.ellipseHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        var ellipsoid = scene.globe.ellipsoid;

        this.ellipseHandler.setInputAction(function (event) {
            var windowPosition = getPosition(event);
            firstCartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
            isLeftDown = true;
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        this.ellipseHandler.setInputAction(function (event) {
            if (flag && isLeftDown) {
                scene.screenSpaceCameraController.enableRotate = false;
                var windowPosition = event.startPosition;
                secondCartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                centerPosition = new Cesium.Cartesian3((firstCartesian.x + secondCartesian.x) / 2, (firstCartesian.y + secondCartesian.y) / 2, (firstCartesian.z + secondCartesian.z) / 2);
                var temp = new Cesium.Cartesian3(firstCartesian.x, secondCartesian.y, centerPosition.z);
                var distance1 = Cesium.Cartesian3.distance(temp, secondCartesian) / 2;
                var distance2 = Cesium.Cartesian3.distance(temp, firstCartesian) / 2;
                // 长半轴
                semiMajorAxis = (distance1 >= distance2) ? distance1 : distance2;
                // 短半轴
                semiMinorAxis = (distance1 < distance2) ? distance1 : distance2;
                viewer.entities.removeById(id);

                if (semiMajorAxis > 0 && semiMinorAxis > 0) {
                    var ellipse = drawEllipse(id, entity, centerPosition, semiMinorAxis, semiMajorAxis);
                    ellipseArray[pointer] = ellipse;
                    pointer++;
                    pointData.center = centerPosition;
                    pointData.value[0] = Cesium.Math.toDegrees(ellipsoid.cartesianToCartographic(centerPosition).longitude).toFixed(8);
                    pointData.value[1] = Cesium.Math.toDegrees(ellipsoid.cartesianToCartographic(centerPosition).latitude).toFixed(8);
                    pointData.value[2] = semiMinorAxis;
                    pointData.value[3] = semiMajorAxis;

                    plotObject.entity.ellipse.push(pointData);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.ellipseHandler.setInputAction(function () {
            flag = false;
            scene.screenSpaceCameraController.enableRotate = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
    };

    var drawEllipse = function (id, entity, center, semiMinorAxis, semiMajorAxis) {
        var ellipse = viewer.entities.add({
            position: center,
            id: id,
            name: 'ellipse',
            ellipse: {
                semiMinorAxis: semiMinorAxis,
                semiMajorAxis: semiMajorAxis,
                height: 0,
                fill: true,
                outline: true,
                outlineColor: Cesium.Color.BLACK,
                material: Cesium.Color.RED.withAlpha(0.5)
            }
        });

        return ellipse;
    }

    ellipsePlotting.prototype.destroy = function (viewer) {
        if (!this.ellipseHandler.isDestroyed()) {
            this.ellipseHandler.destroy();
        }
    };
    return ellipsePlotting;
})
