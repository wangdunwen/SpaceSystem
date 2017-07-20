/**
 * Created by 710-6 on 2016/10/11.
 */
define(['./Tools'],function(tools){
    var tool = new tools();
    //距离
    var distance = 0;
    //单位
    var unit = "公里";
    var drawLine=function(){};

    /**
     * 根据参数个数决定是否显示长度信息
     * 当参数个数为3：画线计算距离
     * 当参数个数为4：画线计算距离并显示距离
     */
    drawLine.prototype.drawline=function(){
        switch(arguments.length) {
            case 3:
                return getDistanceOnly(arguments);
                break;
            case 4:
                return getDistanceAndShowIt(arguments);
                break;
            default :
                break;
        }
    };

    /**
     * 画线并计算距离，不显示距离信息
     * @param arguments
     * @returns {{}}
     */
    function getDistanceOnly(arguments) {
        var startPos = tool.cartesianToCoords(arguments[0], arguments[1]);
        var endPos = tool.cartesianToCoords(arguments[0], arguments[2]);
        var result = {};

        viewer.entities.add({
            id: 'line',
            name: 'line',
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([startPos.longitude, startPos.latitude, endPos.longitude, endPos.latitude]),
                width: 1,
                material: Cesium.Color.YELLOW
            }
        });
        result =  tool.getDistance(startPos.longitude, startPos.latitude, endPos.longitude, endPos.latitude);

        return result;
    }

    /**
     * 画线计算距离并显示
     * @param arguments
     * @returns {{entity: *, type: string}}
     */
    function getDistanceAndShowIt(arguments) {
        // 计算并显示距离
        distance = tool.getDistance(arguments[1].longitude, arguments[1].latitude,  arguments[2].longitude, arguments[2].latitude);
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

        var redLine = null;


        redLine = arguments[0].entities.add({
            name: arguments[3],
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([arguments[1].longitude, arguments[1].latitude, arguments[2].longitude, arguments[2].latitude]),
                width: 1,
                material: Cesium.Color.YELLOW
            }
        });
        console.log(redLine)

        $('#description').html("距离为" + distance + unit);

        return {"entity": redLine, "type": "polyline"};
    }
    return drawLine;
});