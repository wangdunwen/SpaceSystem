/**
 * Created by wangdunwen on 2017/2/15.
 */
define(['../data/ProvinceData'],
    function (provinceData) {

        var provinceData = new provinceData();

        var search = function () {
            const ProvinceArray = provinceData.getProvinceData();
            var province_name = new Array();

            for (var i = 0; i < ProvinceArray.length; i++) {
                province_name[i] = ProvinceArray[i].name;
            }

            $('#search_name').on('input', function () {
                if ($(this).val() === '') {
                    $('#ul_list').hide();
                    console.log("请输入。。。。");
                    return;
                }
                $('#ul_list').show();
                $('#ul_list').html("");
                //索取搜索框中的信息
                var value = $('#search_name').val();


                var name_arr = searchByName(value, province_name);
                for (var i = 0; i < (name_arr.length > 5 ? 5 : name_arr.length); i++) {
                    $('#ul_list').append('<li id="place_' + i + '" value="' + name_arr[i] + '" name="searchList">' + name_arr[i] + '</li>')
                }

                $($('#ul_list').children().get(0)).click(function () {
                    console.log($('#ul_list').children().get(0).innerHTML);
                    viewer.entities.removeAll();
                    viewer.dataSources.removeAll();
                    $('#search_name').val($('#ul_list').children().get(0).innerHTML);
                    $('#ul_list').hide();
                    showSearch($('#ul_list').children().get(0).innerHTML)
                })
                $($('#ul_list').children().get(1)).click(function () {
                    console.log($('#ul_list').children().get(1).innerHTML);
                    viewer.entities.removeAll();
                    viewer.dataSources.removeAll();
                    $('#search_name').val($('#ul_list').children().get(1).innerHTML);
                    $('#ul_list').hide();
                    showSearch($('#ul_list').children().get(1).innerHTML)
                })
                $($('#ul_list').children().get(2)).click(function () {
                    console.log($('#ul_list').children().get(2).innerHTML);
                    viewer.entities.removeAll();
                    viewer.dataSources.removeAll();
                    $('#search_name').val($('#ul_list').children().get(2).innerHTML);
                    $('#ul_list').hide();
                    showSearch($('#ul_list').children().get(2).innerHTML)
                })
                $($('#ul_list').children().get(3)).click(function () {
                    console.log($('#ul_list').children().get(3).innerHTML);
                    viewer.entities.removeAll();
                    viewer.dataSources.removeAll();
                    $('#search_name').val($('#ul_list').children().get(3).innerHTML);
                    $('#ul_list').hide();
                    showSearch($('#ul_list').children().get(3).innerHTML)
                })
                $($('#ul_list').children().get(4)).click(function () {
                    console.log($('#ul_list').children().get(4).innerHTML);
                    viewer.entities.removeAll();
                    viewer.dataSources.removeAll();
                    $('#search_name').val($('#ul_list').children().get(4).innerHTML);
                    $('#ul_list').hide();
                    showSearch($('#ul_list').children().get(4).innerHTML)
                })
            })

            $('#search').click(function () {
                if ($('#search_name').val() === "") {
                    var pop = new Popup({
                        contentType: 4,
                        isReloadOnClose: false,
                        width: 340,
                        height: 80
                    });

                    pop.setContent("title", "提示！");
                    pop.setContent("alertCon", "请输入地名！");
                    pop.build();
                    pop.show();
                    return;
                }

                var location = [];
                var point = "";
                var searchUrl = "http://restapi.amap.com/v3/geocode/geo?address=" + $('#search_name').val() + "&output=JSON&key=102a6884c29164d01d8087aeaf795cc1";
                $.ajax({
                    type: "get",
                    async: false,
                    url: searchUrl,
                    /*dataType: "jsonp",
                     jsonp: "callback",
                     jsonpCallback: "gfplatform",*/
                    success: function (json) {
                        $('#ul_list').show();
                        $('#ul_list').html("");
                        console.log(json);
                        if(point !== "") {
                            point = "";
                            viewer.entities.remove(point);
                        }
                        location = json.geocodes[0].location;
                        var locArr = location.split(",");
                        var lng = parseFloat(locArr[0]).toFixed(5);
                        var lat = parseFloat(locArr[1]).toFixed(5);
                        //搜索到结果后视角飞向该地点
                        viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(lng, lat, 2000.0),
                            duration: 5
                        })
                        setTimeout(function() {
                            point = viewer.entities.add({
                                name: '端点',
                                position: Cesium.Cartesian3.fromDegrees(lng, lat),
                                point: {
                                    color: Cesium.Color.RED,
                                    pixelSize: 12,
                                    outlineColor: Cesium.Color.BLACK,
                                    outlineWidth: 1
                                }
                            });
                        }, 4000);
                    },
                    error: function () {
                        console.log("fail");
                    }
                });

                if(location.length != 0) {
                    return;
                }

                if ($('#ul_list').html() === "") {
                    var pop = new Popup({
                        contentType: 4,
                        isReloadOnClose: false,
                        width: 340,
                        height: 80
                    });

                    pop.setContent("title", "提示！");
                    pop.setContent("alertCon", "请输入正确的地名！");
                    pop.build();
                    pop.show();
                    $('#search_name').val("");
                    return;
                }
            });

            function showSearch(value) {

                //显示搜索框中的搜索内容
                for (var i = 0; i < ProvinceArray.length; i++) {
                    if (value == ProvinceArray[i].name) {
                        viewer.infoBox._container.style = true;
                        var datasource = Cesium.GeoJsonDataSource.load('data/vector/chineseProvince/' + ProvinceArray[i].word + '.json', {
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
        };

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


        return search;
    });