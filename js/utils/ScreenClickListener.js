/**
 * Created by wangdunwen on 2017/1/17.
 */
define(function () {
    var screenClickListener = function () {
        this.clickListener = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        // 监听点击事件
        this.clickListener.setInputAction(function (event) {
            // 获得点击坐标
            var windowPosition = getPosition(event);
            //根据点击的坐标查找当前位置的对象
            {
                // 必须先执行这句才能确保获取的pickedObject不为空
                viewer.scene.pick(windowPosition);
            }

            var pickedObject = viewer.scene.pick(windowPosition);

            // 对象如果已经存在该
            if (Cesium.defined(pickedObject)) {
                // 获得当前点击位置的实体
                var entity = pickedObject.id;
                console.log("点击的实体为:" + entity.name);
                switch (entity.name) {
                    case "picture":
                        showPicture(entity, windowPosition);
                        break;
                    case "video":
                        broadcastEntity(entity, windowPosition);
                        break;
                    case "audio":
                        broadcastEntity(entity, windowPosition);
                        break;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        var showPicture = function (entity, windowPosition) {
            viewer.scene.screenSpaceCameraController.enableRotate = false;
            $("#editBtn").html("<div><div><button id='broadcastEntity' value='播放'>原图</button></div>" +
                "<div><button id='deleteEntity' value='删除'>删除</button></div>" +
                "<div><button id='escEdit' value='取消'>取消</button></div>");
            $("#editBtn")[0].style.position = "absolute";
            $("#editBtn")[0].style.top = windowPosition.y  + 100 + "px";
            $("#editBtn")[0].style.left = windowPosition.x + 250 + "px";
            $("#editBtn").position("absolute");
            $("#broadcastEntity").click(function () {
                $("#videobroadcast").show();
                var fileUrl = entity.HDPic;
                $("#videoDisplay").html("<div><img id='takephoto' src=" + fileUrl + " style='position: absolute;left: 30%; top: 17%; width: 40%; height:80%;'/></div>");
                $("#videoClose").click(function () {
                    $("#videoDisplay").html("");
                    $("#videobroadcast").hide();
                });
            });
            $("#deleteEntity").click(function () {
                $("#broadcastPanel").html("");
                $("#broadcastPanel").hide();
                viewer.entities.remove(entity);
                $('#broadcastEntity').css('display', 'none')
                $('#deleteEntity').css('display', 'none')
                $('#escEdit').css('display', 'none')
                viewer.scene.screenSpaceCameraController.enableRotate = true;
            });
            $("#escEdit").click(function () {
                $("#broadcastPanel").html("");
                $("#broadcastPanel").hide();
                $('#broadcastEntity').css('display', 'none')
                $('#deleteEntity').css('display', 'none')
                $('#escEdit').css('display', 'none')
                viewer.scene.screenSpaceCameraController.enableRotate = true;
            });
        };

        var broadcastEntity = function (entity, windowPosition) {
            //对视频和语音进行编辑
            viewer.scene.screenSpaceCameraController.enableRotate = false;
            $("#editBtn").html("<div><div><button id='broadcastEntity' value='播放'>播放</button></div>" +
                "<div><button id='deleteEntity' value='删除'>删除</button></div>" +
                "<div><button id='escEdit' value='取消'>取消</button></div>");
            $("#editBtn")[0].style.position = "absolute";
            $("#editBtn")[0].style.top = windowPosition.y + 100 + "px";
            $("#editBtn")[0].style.left = windowPosition.x + 250 + "px";
            $("#editBtn").position("absolute");
            $("#broadcastEntity").click(function () {
                // 视频监听处理
                if (entity.name == "video") {
                    $("#videobroadcast").show();
                    $("#videoDisplay").html("<div><video src=" + entity.video + " id='video2'" +
                        "style='position: absolute;top:20%; left: 16%; height:70%;width:74%;'controls='controls'></div>");
                }
                // 音频监听处理
                if ((entity.name == "audio" || entity.name == "voice" ) && $('#broadcastEntity').html() === "播放") {
                    $('#broadcastEntity').html("关闭");
                    $("#broadcastPanel").show();
                    $("#broadcastPanel").html(
                        "<div><audio src=" + entity.audio + " controls='controls'/></div>");
                    $("#broadcastPanel")[0].style.position = "absolute";
                    $("#broadcastPanel")[0].style.top = windowPosition.y - 32 + "px";
                } else if ((entity.name == "audio" || entity.name == "voice" ) && $('#broadcastEntity').html() === "关闭") {
                    $('#broadcastEntity').html("播放");
                    $("#broadcastPanel").html("");
                    $("#broadcastPanel").hide();
                }

                $("#videoClose").click(function () {
                    $("#videoDisplay").html("");
                    $("#videobroadcast").hide();
                });
            });
            $("#deleteEntity").click(function () {
                $("#broadcastPanel").html("");
                $("#broadcastPanel").hide();
                viewer.entities.remove(entity);
                $('#broadcastEntity').css('display', 'none')
                $('#deleteEntity').css('display', 'none')
                $('#escEdit').css('display', 'none')
                viewer.scene.screenSpaceCameraController.enableRotate = true;
            });
            $("#escEdit").click(function () {
                $("#broadcastPanel").html("");
                $("#broadcastPanel").hide();
                $('#broadcastEntity').css('display', 'none')
                $('#deleteEntity').css('display', 'none')
                $('#escEdit').css('display', 'none')
                viewer.scene.screenSpaceCameraController.enableRotate = true;
            });
        };
    }
    return screenClickListener;
});