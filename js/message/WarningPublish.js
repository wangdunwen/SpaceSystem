/**
 * Created by wangdunwen on 2016/12/28.
 */
define(['utils/Tools',
'../data/ProvinceData'],
    function (Tools,
              provinceData) {

        var provinceData = new provinceData();
        const ProvinceArray = provinceData.getProvinceData();
        var province_name = new Array();

        for (var i = 0; i < ProvinceArray.length; i++) {
            province_name[i] = ProvinceArray[i].name;
        }

        var tool = new Tools();
        var pop = new Popup({
            contentType: 4,
            isReloadOnClose: false,
            width: 340,
            height: 80
        });
        var data = {
            warnType :"台风",
            warnLevel:"红色"
        };
        /*本地客户端监听警报发布信息*/
        setTimeout(function (){
            socket.on("warningLocal", function(data){
                setTimeout(function() {
                    console.log(data);
                    switch(data.warnType){
                        case "台风":
                            pop.setContent("title", "警报！");
                            pop.setContent("alertCon", "注意台风！");
                            changeColorByLevel(data.warnLevel);
                            pop.build();
                            pop.show();
                            $("#bg_music").show();
                            $("#bg_music").append("<audio id='m_bg_music' loop volume='60' autoplay=true hidden=true src='resources/audio/fly.mp3' /> ");
                            break;
                        case "地震":
                            pop.setContent("title", "警报！");
                            pop.setContent("alertCon", "准备地震！");
                            changeColorByLevel(data.warnLevel);
                            pop.build();
                            pop.show();
                            $("#bg_music").show();
                            $("#bg_music").append("<audio id='m_bg_music' loop volume='60' autoplay=true hidden=true src='resources/audio/attack.mp3' /> ");
                            break;
                        case "暴雨":
                            pop.setContent("title", "警报！");
                            pop.setContent("alertCon", "注意暴雨！");
                            changeColorByLevel(data.warnLevel);
                            pop.build();
                            pop.show();
                            $("#bg_music").show();
                            $("#bg_music").append("<audio id='m_bg_music' loop volume='60' autoplay=true hidden=true src='resources/audio/watch.mp3' /> ");
                            break;
                    };
                    pop.color = {
                        cColor: "#000000",
                        bColor: "#D1D1D1",
                        tColor: "#5CACEE",
                        wColor: "#FFFFFF"
                    };
                }, 3000);

                function changeColorByLevel(color){
                    switch(color){
                        case "红色": pop.color.tColor = "#CD0000";break;
                        case "橙色": pop.color.tColor = "#EE9A00";break;
                        case "蓝色": pop.color.tColor = "#1C86EE";break;
                    }
                };
            });
        },1000);


        var warningPublish = function () {
            var ip = "";
            //发布台风警报
            $('#warnWind').click(function () {
                data.warnType = "台风";
            });
            //发布地震警报
            $('#warnEarthquake').click(function () {
                data.warnType = "地震";
            });
            //发布暴雨警报
            $('#warnRain').click(function () {
                data.warnType = "暴雨";
            });
            //警报级别
            $('#warnRed').click(function () {
                data.warnLevel = "红色";
            });
            //发布地震警报
            $('#warnOrange').click(function () {
                data.warnLevel = "橙色";
            });
            //发布暴雨警报
            $('#warnBlue').click(function () {
                data.warnLevel = "蓝色";
            });
            //发布警报
            $('#sendWarn').click(function () {
                ip = "127.0.0.1";
                //索取搜索框中的信息
                var value =  $('#contentIp').val();
                var name_arr = searchByName(value, province_name);
                /*var valid = tool.isValidIp(ip);*/
                if (name_arr == []) {
                    /*$('#contentIp').val("");*/
                    pop.setContent("title", "提示");
                    pop.setContent("alertCon", "请输入正确的地名后继续！");
                    pop.build();
                    pop.show();
                    return;
                }else {
                    var socket_other = io('http://' + ip + ':8080');

                    /*连接成功*/
                    socket_other.once("connect", function () {
                        console.log("连接设备服务器成功！");
                        socket_other.emit("warning", data);
                        showSearch(value)
                        pop.setContent("title", "提示");
                        pop.setContent("alertCon", "警报发布成功！");
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

        function showSearch(value) {

            //显示搜索框中的搜索内容
            for (var i = 0; i < ProvinceArray.length; i++) {
                if (value == ProvinceArray[i].name) {
                    viewer.infoBox._container.style = true;
                    var datasource = Cesium.GeoJsonDataSource.load('data/vector/chineseProvince/' + ProvinceArray[i].word +'.json', {
                        stroke: Cesium.Color.YELLOW,
                        fill: Cesium.Color.YELLOW.withAlpha(0.3),
                        strokeWidth: 5.0
                    });
                    viewer.dataSources.add(datasource);

                    viewer.entities.add({
                        name: '端点',
                        position: Cesium.Cartesian3.fromDegrees(ProvinceArray[i].value[0], ProvinceArray[i].value[1]),
                        point: {
                            color: Cesium.Color.RED,
                            pixelSize: 4,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 1
                        }
                    });
                    viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(ProvinceArray[i].value[0], ProvinceArray[i].value[1]),
                        name: "label",
                        label: {
                            text: ProvinceArray[i].name,
                            font: '24px Helvetica',
                            fillColor: Cesium.Color.SKYBLUE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -9)
                            //translucencyByDistance : new Cesium.NearFarScalar(1.5e5, 1.0, 1.5e7, 0.0)
                        }
                    });
                    viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(ProvinceArray[i].value[0], ProvinceArray[i].value[1], 1500000.0),
                        duration: 2
                    })
                    break;
                }
                continue;
            }
        }

        var searchByName = function (str, data) {
            var Results = [];
            /*中文搜索*/
            for (var i in data) {
                /*正则匹配，以搜索值为开头*/
                var regExp = new RegExp("^(" + str + ")");
                if (regExp.test(data[i])) {
                    Results.push(data[i]);
                }
            }
            //console.log("结果 is " + Results);
            return Results;
        }

        return warningPublish;
    });