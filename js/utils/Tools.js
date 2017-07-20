/**
 * Created by wangdunwen on 2017/1/17.
 */

define(function(){
    var tools = function(){
    }

    function getRad(d) {
        var PI = Math.PI;
        return d * PI / 180.0;
    }

    tools.prototype.getDistance = function(lng1, lat1, lng2, lat2) {
        var EARTH_RADIUS = 6378137.0;
        var f = getRad((lat1 + lat2) / 2);
        var g = getRad((lat1 - lat2) / 2);
        var l = getRad((lng1 - lng2) / 2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s, c, w, r, d, h1, h2;
        var a = EARTH_RADIUS;
        var fl = 1 / 298.257;

        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;

        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;

        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;

        //return Math.round((d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))) / 1000);
        return ((d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))) / 1000);
    }

    tools.prototype.initTimeline = function(viewer, start, stop, multiplier, clockRange) {
        //设置起止时间
        if (start !== undefined && stop !== undefined) {
            viewer.clock.startTime = start.clone();
            viewer.clock.stopTime = stop.clone();
            viewer.clock.currentTime = start.clone();
        }
        //设置时间流逝速度
        if (multiplier !== undefined) {
            viewer.clock.multiplier = multiplier;
        } else {
            viewer.clock.multiplier = 1;
        }
        //设置时间范围
        if (clockRange !== undefined) {
            viewer.clock.clockRange = clockRange;
        } else {
            viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
        }
        viewer.timeline.zoomTo(start, stop);
    };

    tools.prototype.cartesianToCoords = function (ellipsoid, cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var longitudeFloat = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(4));
        var latitudeFloat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(4));
        return {"longitude": longitudeFloat, "latitude": latitudeFloat};
    };

    /**
     *利用正则表达式判断ipv4是否合法
     * @param ip
     * @returns {boolean}
     */
    tools.prototype.isValidIp = function (ip) {
        if (!ip) {
            return false;
        }
        var reg = /^((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){3}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/;
        return !!(reg.exec(ip));
    };

    return tools;
})