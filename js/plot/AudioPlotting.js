/**
 * Created by WangJiuLong on 2016/1/29.
 */
define(["../utils/Tools"],function (Tools) {
    var tool = new Tools();

    var audioPlotting = function (audioArray, plotObject) {
        var pointer = audioArray.length;
        var that = this;
        var flag = true;
        var entity;
        var scene = viewer.scene;
        this.AudioHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        var ellipsoid = scene.globe.ellipsoid;

        //设置音频路径
        var map3Path = 'resources/audio/1.mp3';
        var oggPath = 'resources/audio/1.ogg';
        var wavPath = 'resources/audio/1.wav';
        var wmaPath = 'resources/audio/1.wma';

        //设置图标路径
        var mp3Icon = "resources/images/audioMP3.png";
        var oggIcon = "resources/images/audioOGG.png";
        var wavIcon = "resources/images/audioWAV.png";
        var wmaIcon = "resources/images/audioWMA.png";

        //音频点击事件
        $("#mp3Audio").click(function () {
            audioPlot(map3Path, mp3Icon);
        });

        $("#oggAudio").click(function () {
            audioPlot(oggPath, oggIcon);
        });

        $("#wavAudio").click(function () {
            audioPlot(wavPath, wavIcon);
        });

        $("#wmaAudio").click(function () {
            audioPlot(wmaPath, wmaIcon);
        });

        $("#localAudio").change(function(){
            var file;
            for(var i=0; i<this.files.length; i++) {
                file = this.files[i];
                transferLocalPhoto(file);
            }
        });


        function transferLocalPhoto(file) {
            var fileName = file.name;
            console.log(fileName);
            //保存缩略图
            var reader_url = new FileReader();
            reader_url.readAsBinaryString(file);
            reader_url.onload = function (e) {
                $.ajax({
                    type: "POST",
                    url: "/saveAudio",
                    data: {filename: "resources/audio/" + fileName, data: this.result},
                    success: function (data) {
                        console.log("保存音频文件成功!");
                    }
                })
            }
        }

        function audioPlot(url, icon) {
            if (that.AudioHandler.isDestroyed()) {
                console.log("AudioHandler isDestroyed");
                return;
            }
            that.AudioHandler.setInputAction(function (event) {
                var windowPosition = getPosition(event);
                var pickedObject = scene.pick(windowPosition);
                //如果已经存在该Point则改变属性
                if (Cesium.defined(pickedObject)) {
                    entity = pickedObject.id;
                    if (entity.name === "audio") {
                        return;
                    }
                }
                else if (flag) {
                    var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                    var audioTemp = viewer.entities.add({
                        name: "audio",
                        position: cartesian,
                        audio: url,
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
                        audioTemp.description = $("#descriptionForEntity").val();
                        $("#descriptionForEntityDiv").hide();
                    });
                    audioArray[pointer++] = audioTemp;
                    /*保存音频*/
                    var objectTemp = {
                        position: cartesian,
                        url: icon,
                        rawUrl: url
                    };
                    plotObject.entity.audio.push(objectTemp);
                }
                // 结束本次标注
                flag = false;
                if (!that.AudioHandler.isDestroyed()) {
                    that.AudioHandler.destroy();
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        }
    };

    /**
     * handler销毁
     * @param viewer
     */
    audioPlotting.prototype.destroy = function (viewer) {
        if (!this.AudioHandler.isDestroyed()) {
            this.AudioHandler.destroy();
        }
    };
    return audioPlotting;
})