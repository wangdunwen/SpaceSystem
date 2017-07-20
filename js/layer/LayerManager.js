/**
 * Created by wangdunwen on 2017/1/17.
 */
define([
    './CityManager',
    './TerrainManager',
    './VectorManager',
    './OnlineMapManger'
],function(
    CityManager,
    TerrainManager,
    VectorManager,
    OnlineMapManger
) {
    var cityManager,terrainManager,vectorManager,onlineMapManger;

    var layerManager = function() {

        /*高分数据*/
        $("#cityData").click(function() {
            destroyAll();
            if( $("#cityPanel").is(":hidden") ) {
                $("#cityPanel").show();
                cityManager = new CityManager();
            }else {
                $("#cityPanel").hide();
            }
        });

        /*高程数据*/
        $("#terrainData").click(function() {
            destroyAll();
            if( $("#terrainPanel").is(":hidden") ) {
                $("#terrainPanel").show();
                terrainManager = new TerrainManager();
            }else {
                $("#terrainPanel").hide();
            }
        });

        /*矢量数据*/
        $("#vectorData").click(function() {
            destroyAll();
            if( $("#vectorPanel").is(":hidden") ) {
                $("#vectorPanel").show();
                vectorManager = new VectorManager();
            }else {
                $("#vectorPanel").hide();
            }
        });

        /*在线地图*/
        $("#onlineMapService").click(function() {
            destroyAll();
            if( $("#onlineMapPanel").is(":hidden") ) {
                $("#onlineMapPanel").show();
                onlineMapManger = new OnlineMapManger();
            }else {
                $("#onlineMapPanel").hide();
            }
        });

        function destroyAll() {
            if(cityManager !== undefined){
                cityManager.destroy();
            }
            if(terrainManager !== undefined){
                terrainManager.destroy();
            }
            if(vectorManager !== undefined){
                vectorManager.destroy();
            }
            if(onlineMapManger !== undefined){
                onlineMapManger.destroy();
            }
        }

    };
    return layerManager;
});