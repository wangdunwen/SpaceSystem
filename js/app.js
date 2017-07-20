/**
 * Created by wangdunwen on 16/11/8.
 */

require([
    './cloud/CloudManager',
    './layer/LayerManager',
    './location/LocationManager',
    './plot/PlottingManager',
    './utils/ScreenClickListener',
    './utils/SocketManager',
    './manager/Search',
    './message/MessageManager'
], function(CloudManager,
            LayerManager,
            LocationManager,
            PlottingManager,
            ScreenClickListener,
            SocketManager,
            Search,
            MessageManager) {

    new CloudManager();
    new LayerManager();
    new LocationManager();
    new PlottingManager();
    new ScreenClickListener();
    new SocketManager();
    new Search();
    new MessageManager();

    viewer.animation.container.style.display = "none";
    viewer.timeline.container.style.display = "none";
    viewer.infoBox._container.style.display = "block";

    window.getPosition = function (event) {
        var windowPosition;
        var pos = event.position || window.event;
        windowPosition = new Cesium.Cartesian2(pos.x, pos.y);
        return windowPosition;
    };
});