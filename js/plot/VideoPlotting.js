/**
 * Created by WangDunWen on 2017/3/19.
 */
define(["../utils/Tools"],function (Tools) {
    var tool = new Tools();

    var videoPlotting = function (videoArray, plotObject) {
        var pointer = videoArray.length;
        var that = this;
        //判断当前是否进入标绘状态
        var flag = true;
        var entity;
        var scene = viewer.scene;
        this.VideoHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        var ellipsoid = scene.globe.ellipsoid;
        //视频资源文件路径
        var aviPath, flvPath, mp4Path, mpgPath, wmvPath;
        //对应图标
        var aviIcon, flvIcon, mp4Icon, mpgIcon, wmvIcon;

        //设置图标路径
        aviIcon = "resources/images/videoAVI.png";
        flvIcon = "resources/images/videoFLV.png";
        mp4Icon = "resources/images/videoMP4.png";
        mpgIcon = "resources/images/videoMPG.png";
        wmvIcon = "resources/images/videoWMV.png";

        //设置视频路径
        aviPath = "resources/video/1.avi";
        flvPath = "resources/video/1.flv";
        mp4Path = "resources/video/1.MP4";
        mpgPath = "resources/video/1.mpg";
        wmvPath = "resources/video/1.wmv";


        $("#aviVideo").click(function () {
            videoPlot(aviPath, aviIcon);
        })
        $("#flvVideo").click(function () {
            videoPlot(flvPath, flvIcon);
        })
        $("#mp4Video").click(function () {
            videoPlot(mp4Path, mp4Icon);
        })
        $("#mpgVideo").click(function () {
            videoPlot(mpgPath, mpgIcon);
        })
        $("#wmvVideo").click(function () {
            videoPlot(wmvPath, wmvIcon);
        })

        function videoPlot(url, icon) {
            if (that.VideoHandler.isDestroyed()) {
                console.log("ThreeDHandler isDestroyed");
                return;
            }
            that.VideoHandler.setInputAction(function (event) {
                var windowPosition = getPosition(event);
                var pickedObject = scene.pick(windowPosition);
                if (Cesium.defined(pickedObject)) {  //如果已经存在该Point则改变属性
                    entity = pickedObject.id;
                    if (entity.name === "video") {
                        return;
                    }
                }
                else if (flag) {
                    var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                    var videoTemp = viewer.entities.add({
                        name: "video",
                        position: cartesian,
                        video: url,
                        billboard: {
                            scale: 0.5,//缩小图片比例
                            image: icon
                        }
                    });
                    if(isTourist == true) {
                        touristLocationArr.push(tool.cartesianToCoords(ellipsoid, cartesian));
                        console.log(touristLocationArr);
                    }
                    $("#descriptionForEntityDiv").show();
                    $("#addDescription").unbind("click").click(function() {
                        videoTemp.description = $("#descriptionForEntity").val();
                        $("#descriptionForEntityDiv").hide();
                    });
                    videoArray[pointer++] = videoTemp;
                    /*保存视频*/
                    var objectTemp = {
                        position: cartesian,
                        url: icon,
                        rawUrl: url
                    };
                    plotObject.entity.video.push(objectTemp);
                }
                // 结束本次标注
                flag = false;
                if (!that.VideoHandler.isDestroyed()) {
                    that.VideoHandler.destroy();
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            $("#VideoPanel").hide();
        }
    }

    videoPlotting.prototype.destroy = function (viewer) {
        if (!this.VideoHandler.isDestroyed()) {
            this.VideoHandler.destroy();
        }
    };
    return videoPlotting;
})