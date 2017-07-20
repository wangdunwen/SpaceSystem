/**
 * Created by wangdunwen on 2017/1/17.
 */
define(function() {
    var vectorManager = function() {

        $("#chinaVector").click(function () {
            var provinceArray = ["anhui", "beijing", "chongqing", "fujian", "gansu", "guangdong", "guangxi",
            "guizhou", "hainan", "hebei", "hebei", "heilongjiang", "henan", "hubei", "hunan", "jiangsu",
            "jiangxi", "jilin", "liaoning", "neimenggu", "ningxia", "qinghai", "shan1xi", "shan3xi", "shandong",
            "shanghai", "sichuan", "taiwan", "tianjin", "xinjiang", "xizang", "yunnan", "zhejiang"];
            var dataSource =[];
            var i = 0;
            viewer.infoBox._container.style = true;
            dataSource[i++] = Cesium.GeoJsonDataSource.load('data/vector/chineseProvince/china.json', {
                stroke: Cesium.Color.YELLOW,
                fill: Cesium.Color.RED.withAlpha(0.0),
                strokeWidth: 5.0
            });

            for(var j=0; j<provinceArray.length; j++){
                dataSource[i++] = jsonDataLoad(provinceArray[j]);
            }

            for (; i >= 1; i--) {
                dataSource[i - 1].then(function (dataSource) {
                    viewer.dataSources.add(dataSource);
                    var entities = dataSource.entities.values;
                    for (var i = 0; i < entities.length; i++) {
                        var entity = entities[i];
                        var label = new Cesium.Entity({
                            name: 'label',
                            position: Cesium.Cartesian3.fromDegrees(entity._properties.中心位置[0], entity._properties.中心位置[1]),
                            label: {
                                text: entity._name,
                                font: '18px Helvetica',
                                fillColor: Cesium.Color.BLACK,
                                outlineColor: Cesium.Color.BLACK,
                                outlineWidth: 2,
                                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                translucencyByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 1.5e6, 0.0)
                            }
                        })
                        viewer.entities.add(entity);
                        viewer.entities.add(label);
                    }
                })

            }
            viewer.scene.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(110.16, 31.71, 10000000)
            });
        });

        $("#jiangsuVector").click(function () {
            viewer.infoBox._container.style = true;
            var datasource = Cesium.GeoJsonDataSource.load('data/vector/chineseProvince/jiangsu.json', {
                stroke: Cesium.Color.YELLOW,
                fill: Cesium.Color.YELLOW.withAlpha(0.3),
                strokeWidth: 5.0
            });
            viewer.dataSources.add(datasource);
            viewer.scene.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(120.16, 31.71, 1000000)
            });
        });

        $("#clearVector").click(function () {
            viewer.entities.removeAll();
            viewer.dataSources.removeAll();
        });
    };

    function jsonDataLoad (place) {
        var dataSource = new Cesium.GeoJsonDataSource(place);
        return dataSource.load('data/vector/chineseProvince/'+ place +'.json', {
            stroke: Cesium.Color.YELLOW,
            fill: Cesium.Color.YELLOW.withAlpha(0.01),
            strokeWidth: 5.0
        });
    }

    vectorManager.prototype.destroy = function(){

    }

    return vectorManager;
});