/**
 * Created by wangdunwen on 2017/1/17.
 */
define(function() {
    var layer1,layer2,layer3,layerCollection;
    var cityManager = function() {
        layerCollection = viewer.scene.imageryLayers;

        $('#SZSatellite').click(function () {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(parseFloat(120.6401), parseFloat(31.3069), 2000),
                duration: 1.0
            });
            viewer.scene.screenSpaceCameraController.enableZoom = true;
            if (layerCollection.contains(layer1)) {
                layerCollection.raiseToTop(layer1);
            } else {
                layer1 = layerCollection.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
                    url: 'data/SuZhouSatellite',
                    credit: '苏州卫星地图'
                }));
            }

        });

        $('#SZDigital').click(function () {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(parseFloat(120.6401), parseFloat(31.3069), 2000),
                duration: 1.0
            });
            viewer.scene.screenSpaceCameraController.enableZoom = true;
            if (layerCollection.contains(layer2)) {
                layerCollection.raiseToTop(layer2);
            } else {
                layer2 = layerCollection.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
                    url: 'data/SuZhouDigital',
                    credit: '苏州电子地图',
                }));
            }
        });

        $('#BJDigital').click(function () {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(parseFloat(116.397), parseFloat(39.916), 2000),
                duration: 1.0
            });
            viewer.scene.screenSpaceCameraController.enableZoom = true;
            if (layerCollection.contains(layer3)) {
                layerCollection.raiseToTop(layer3);
            } else {
                layer3 = layerCollection.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
                    url: 'data/BeiJingDigital',
                    credit: '北京电子地图',
                }));
            }
        });

        $("#clearCity").click(function() {
            flyToDestnation();
            remomveAllLayers()
        });
    };

    function flyToDestnation() {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(110, 31, 23000000)
        });
    }

    function remomveAllLayers() {
        viewer.scene.screenSpaceCameraController.enableZoom = true;

        if (layerCollection.contains(layer1)) {
            layerCollection.remove(layer1, false);
        }
        if (layerCollection.contains(layer2)) {
            layerCollection.remove(layer2, false);
        }
        if (layerCollection.contains(layer3)) {
            layerCollection.remove(layer3, false);
        }
    }

    cityManager.prototype.destroy = function(){

    }

    return cityManager;
});