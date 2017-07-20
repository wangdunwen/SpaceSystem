/**
 * Created by wangdunwen on 2017/1/17.
 */
define(function() {
    var layer1,layer2,layer3,layer4,layer5, layer6, layerCollection;
    var onlineMapManager = function() {
        layerCollection = viewer.scene.imageryLayers;

        //全球矢量地图
        $('#globeVector').click(function () {
            if (layerCollection.contains(layer1)) {
                layerCollection.raiseToTop(layer1);
            } else {
                layer1 = layerCollection.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                    layer: "tdtVecBasicLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    show: false
                }));
            }
            if (layerCollection.contains(layer3)) {
                layerCollection.raiseToTop(layer3);
            } else {
                layer3 = layerCollection.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
                    layer: "tdtAnnoLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible"
                }));
            }

        });

        //全球影像地图
        $('#globeImagery').click(function () {
            if (layerCollection.contains(layer2)) {
                layerCollection.raiseToTop(layer2);
            } else {
                layer2 = layerCollection.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                    layer: "tdtBasicLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    show: false
                }));
            }
            if (layerCollection.contains(layer3)) {
                layerCollection.raiseToTop(layer3);
            } else {
                layer3 = layerCollection.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
                    layer: "tdtAnnoLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    show: false
                }));
            }
        });

        //全球夜间影像地图
        $('#globeNightImagery').click(function () {
            if (layerCollection.contains(layer5)) {
                layerCollection.raiseToTop(layer5);
            } else {
                layer5 = layerCollection.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                    url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
                }));
            }
            if (layerCollection.contains(layer6)) {
                layerCollection.raiseToTop(layer6);
            } else {
                layer6 = layerCollection.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
                    url : 'https://cesiumjs.org/blackmarble',
                    credit : 'Black Marble imagery courtesy NASA Earth Observatory',
                    flipXY : true // Only old gdal2tile.py generated tilesets need this flag.
                }));
                layer6.alpha = 0.5;
                layer6.brightness = 2.0;
            }
        });

        //删除全球地图数据
        $('#clearGlobeImagery').click(function () {
            flyToDestnation();
            remomveAllLayers();
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
        if (layerCollection.contains(layer4)) {
            layerCollection.remove(layer4, false);
        }
        if (layerCollection.contains(layer5)) {
            layerCollection.remove(layer5, false);
        }
        if (layerCollection.contains(layer6)) {
            layerCollection.remove(layer6, false);
        }

    }

    onlineMapManager.prototype.destroy = function(){

    }

    return onlineMapManager;
});