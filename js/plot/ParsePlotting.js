define(function () {
    var parseEntity = [];
    var parsePlotting = function () {
        /**
         * 调用nodejs解析标注
         */
        $.ajax({
            url: "/readPlot/",
            method: "GET",
            success: function (data) {
                console.log("解析成功");
                //需要再次格式化
                var msg = JSON.parse(data);
                parseEntityPlotFromFile(JSON.parse(msg));
            }
        })
    }

    /**
     * 调用此函数进行标注文件解析
     * @param msg 将要解析的信息
     */
    function parseEntityPlotFromFile(msg) {
        if (msg.point) {
            console.log("解析出point");
            for (var i = 0; i < msg.point.length; i++) {
                if (msg.point[i] === null) {
                    return
                }
                var entity = viewer.entities.add({
                    name: '点',
                    position: msg.point[i],
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 4,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 1
                    }
                })
                parseEntity.push(entity);
            }
        }
        if (msg.polyline) {
            console.log("解析出polyline");
            console.log("msg.polyline.length = " + msg.polyline.length);
            for (var j = 0; j < msg.polyline.length; j++) {
                console.log("我出现了几次啊");
                for (var i = 0; i < (msg.polyline[j].length) / 2 - 1; i++) {
                    var entity = viewer.entities.add({
                        name: '线段',
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArray([msg.polyline[j][2 * i],
                                msg.polyline[j][2 * i + 1], msg.polyline[j][2 * i + 2], msg.polyline[j][2 * i + 3]
                            ]),
                            material: Cesium.Color.RED.withAlpha(0.2),
                            width: 1
                        }
                    })
                    parseEntity.push(entity);
                }
            }
        }
        if (msg.polygon) {
            console.log("解析出polygon");
            for (var i = 0; i < msg.polygon.length; i++) {
                var entity = viewer.entities.add({
                    name: '多边形',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray(msg.polygon[i]),
                        material: Cesium.Color.RED.withAlpha(0.2)
                    }
                });
                parseEntity.push(entity);
            }
        }
        if (msg.rectangle) {
            console.log("解析出rectangle");
            for (var i = 0; i < msg.rectangle.length; i++) {
                var entity = viewer.entities.add({
                    name: 'rectangle',
                    rectangle: {
                        coordinates: Cesium.Rectangle.fromDegrees(msg.rectangle[i].value[2], msg.rectangle[i].value[3],
                            msg.rectangle[i].value[4], msg.rectangle[i].value[5]),
                        material: Cesium.Color.RED.withAlpha(0.5),
                        outline: true,
                        outlineColor: Cesium.Color.RED
                    }
                });
                parseEntity.push(entity);
            }
        }
        if (msg.ellipse) {
            console.log("解析出ellipse");
            for (var i = 0; i < msg.ellipse.length; i++) {
                var entity = viewer.entities.add({
                    name: 'ellipse',
                    position: msg.ellipse[i].center,
                    ellipse: {
                        semiMinorAxis: msg.ellipse[i].value[2],
                        semiMajorAxis: msg.ellipse[i].value[3],
                        height: 0,
                        fill: true,
                        outline: true,
                        outlineColor: Cesium.Color.RED,
                        material: Cesium.Color.RED.withAlpha(0.2)
                    }
                });
                parseEntity.push(entity);
            }
        }
        if (msg.image) {
            console.log("解析出image");
            for (var i = 0; i < msg.image.length; i++) {
                var entity = viewer.entities.add({
                    name: "image",
                    HDPic: msg.image[i].rawUrl,
                    position: msg.image[i].position,
                    billboard: {
                        scale: 0.3,//缩小图片比例
                        image: msg.image[i].url,
                    }
                });
                parseEntity.push(entity);
            }
        }
        if (msg.audio) {
            console.log("解析出audio");
            for (var i = 0; i < msg.audio.length; i++) {
                var entity = viewer.entities.add({
                    name: "audio",
                    audio: msg.audio[i].rawUrl,
                    position: msg.audio[i].position,
                    billboard: {
                        scale: 0.5,//缩小图片比例
                        image: msg.audio[i].url
                    }
                });
                parseEntity.push(entity);
            }
        }
        if (msg.video) {
            console.log("解析出video");
            for (var i = 0; i < msg.video.length; i++) {
                var entity = viewer.entities.add({
                    name: "video",
                    position: msg.video[i].position,
                    video: msg.video[i].rawUrl,
                    billboard: {
                        scale: 0.5,
                        image: msg.video[i].url
                    }
                });
                parseEntity.push(entity);
            }
        }

        var pop = new Popup({
            contentType: 4,
            isReloadOnClose: false,
            width: 340,
            height: 80
        });
        pop.setContent("title", "标注解析");
        if (parseEntity.length > 0) {
            pop.setContent("alertCon", "解析成功");
        } else {
            pop.setContent("alertCon", "解析失败");
        }
        pop.build();
        pop.show();
    }

    return parsePlotting;
})