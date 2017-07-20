/**
 * Created by 710-6 on 2016/10/10.
 */
define(function () {

    var drawPoint = function () {
    };

    /**
     * 根据参数个数进行画点
     * @returns {*}
     */
    drawPoint.prototype.drawpoint = function () {
        switch (arguments.length) {
            case 2:
                return addPoint(arguments);
                break;
            case 4:
                return addPointTypeTwo(arguments);
                break;
        }
    };

    /**
     * 根据系统类型按照不同的方式添加点
     */
    function addPoint(arguments) {
        if (arguments[1] === "") {
            var point = {
                name: 'top point',
                position: arguments[0],
                point: {
                    color: Cesium.Color.RED,
                    pixelSize: 4,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 1
                }
            };
        } else {
            var point = {
                id: arguments[1],
                name: 'top point',
                position: arguments[0],
                point: {
                    color: Cesium.Color.RED,
                    pixelSize: 4,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 1
                }
            };
        }
        point = viewer.entities.add(point);
        return point;
    }

    /**
     * 参数个数为4个时，采用这种方式进行添加点
     * @param arguments
     * @returns {{entity: *, type: string, longitude: *, latitude: *, point: Array}}
     */
    function addPointTypeTwo(arguments) {
        var longitudeFloat, latitudeFloat;
        var point = [];
        if (arguments[2]) {
            var cartographic = arguments[1].cartesianToCartographic(arguments[2]);
            longitudeFloat = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
            latitudeFloat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));
            point.push(Number(longitudeFloat), Number(latitudeFloat));

            var redPoint = null;
            switch (arguments[3]) {
                case '顶点':
                    redPoint = arguments[0].entities.add({
                        name: '顶点',
                        position: arguments[2],
                    });
                    break;
                case 'measurePoint':
                    redPoint = arguments[0].entities.add({
                        name: 'measurePoint',
                        position: arguments[2],
                    });
                    break;
                default :
                    break;
            }
            return {
                "entity": redPoint,
                "type": "point",
                "longitude": longitudeFloat,
                "latitude": latitudeFloat,
                "point": point
            };
        }
    }


    return drawPoint;
});