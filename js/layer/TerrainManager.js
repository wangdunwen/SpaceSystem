/**
 * Created by wangdunwen on 2017/1/17.
 */
define(function() {
    var terrainManager = function() {

        $("#openTerrain").click(function() {
            viewer.scene.screenSpaceCameraController.enableZoom = true;
            // 添加影像数据
            viewer.scene.imageryLayers.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
                url: './data/demSatellite',
            }));
            // 添加高程数据
            var terrainProvider = new Cesium.CesiumTerrainProvider({
                url: './data/dem',
                requestVertexNormals: true
            });
            viewer.terrainProvider = terrainProvider;
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(86.500000, 27.50000, 7500),
                //控制视角
                orientation:{
                    pitch : Cesium.Math.toRadians(-10.0),
                }
            });
        });

        $("#closeTerrain").click(function() {
            flyToDestnation();
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        });
    };

    function flyToDestnation() {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(110, 31, 23000000)
        });
    }

    terrainManager.prototype.destroy = function(){

    }

    return terrainManager;
});