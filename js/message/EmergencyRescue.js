/**
 * Created by wangdunwen on 2016/12/28.
 */
define(["utils/Tools"],
    function (Tool) {
        var tool = new Tool();
        var pop = new Popup({
            contentType: 4,
            isReloadOnClose: false,
            width: 340,
            height: 80
        });
        var scene = viewer.scene;
        var entityCollection = [];
        var rescuePic;
        /*本地客户端监听救援信息*/
        setTimeout(function (){
            socket.on("rescueLocal", function(data) {
                setTimeout(function(){
                    rescuePic = viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(data.lng, data.lat),
                        name: "label",
                        label: {
                            text: "SOS",
                            font: '24px Helvetica',
                            fillColor: Cesium.Color.RED,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -10)
                        },
                        point: {
                            color: Cesium.Color.WHITE,
                            pixelSize: 4,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 1
                        },
                        billboard: {
                            scale: 0.1,//缩小图片比例
                            image: "../resources/images/U002.png"
                        }
                    });
                    entityCollection.push(rescuePic);
                    /*镜头飞到目标地点*/
                    viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(data.lng, data.lat, 15000000),
                    });
                    pop.setContent("title", "注意！");
                    pop.setContent("alertCon", "收到紧急救援请求！");
                    pop.color.tColor = "#FFB6C1";
                    pop.build();
                    pop.show();
                    pop.color = {
                        cColor: "#000000",
                        bColor: "#D1D1D1",
                        tColor: "#5CACEE",
                        wColor: "#FFFFFF"
                    };
                },1500);
            });
        }, 1000);

        var emergencyRescue = function (){
            var lng;
            var lat;
            var ip = "";
            /*获取位置*/
            $("#getLocation").click(function(){
                $("#locationLng").html("");
                $("#locationLat").html("");
                $("#showLocation").show();
                if(entityCollection.length >0){
                    for(var i=0; i<entityCollection.length;i++){
                        viewer.entities.remove(entityCollection[i]);
                    }
                    entityCollection = [];
                }
                lng = (Math.random()*1.00 + 119).toFixed(2);
                lat = (Math.random()*1.00 + 30.40).toFixed(2);
                $("#locationLng").html("经度：" + lng);
                $("#locationLat").html("纬度：" + lat);
            });
            //发布警报
            $('#sendRescure').click(function () {
                ip = $('#contentRescure').val();
                var location ={
                    lng: lng,
                    lat: lat
                };
                var valid = tool.isValidIp(ip);
                if (!valid) {
                    $('#contentRescure').val("");
                    pop.setContent("title", "IP格式错误");
                    pop.setContent("alertCon", "请输入正确的IP地址后继续！");
                    pop.build();
                    pop.show();
                }else {
                    ip = "127.0.0.1";
                    var socket_other = io('http://' + ip + ':8080');

                    /*连接成功*/
                    socket_other.once("connect", function () {
                        console.log("连接设备服务器成功！");
                        socket_other.emit("rescue", location);
                        pop.setContent("title", "提示");
                        pop.setContent("alertCon", "救援信息发送成功！");
                        pop.build();
                        pop.show();
                        setTimeout(function () {
                            socket_other.disconnect();
                            socket = io('http://localhost:8080');
                            console.log("数据发送成功,关闭连接！");
                        }, 1000);
                    });

                    /*异常处理*/
                    socket_other.once("error", function(data) {
                        pop.setContent("title", "提示");
                        pop.setContent("alertCon", "发生异常错误，请重新输入IP！");
                        pop.build();
                        pop.show();
                        socket_other.disconnect();
                    });

                    /*连接失败*/
                    socket_other.once("connect_failed", function(data) {
                        pop.setContent("title", "提示");
                        pop.setContent("alertCon", "连接失败，请重新输入IP！");
                        pop.build();
                        pop.show();
                        socket_other.disconnect();
                    });

                    /*超时处理*/
                    socket_other.once("timeout", function() {
                        pop.setContent("title", "提示");
                        pop.setContent("alertCon", "连接超时，请检查网络是否正确连接！");
                        pop.build();
                        pop.show();
                        socket_other.disconnect();
                    });

                    /*超时处理*/
                    socket_other.once("connect_timeout", function() {
                        pop.setContent("title", "提示");
                        pop.setContent("alertCon", "连接超时，请检查网络是否正确连接！");
                        pop.build();
                        pop.show();
                        socket_other.disconnect();
                    });
                }
            });
        };
        return emergencyRescue;
});