/**
 * Created by wangdunwen on 2017/3/15.
 */
define(function() {
    var plottingObject = function() {
        //console.log("plottingObject");
        this.entity = {
            point:[],
            polyline:[],
            polygon:[],
            rectangle:[],
            ellipse:[],
            image:[],
            audio:[],
            video:[]
        }
    };

    plottingObject.prototype.clearAllPlottingObject = function() {
        this.entity.point = [];
        this.entity.polyline = [];
        this.entity.polygon = [];
        this.entity.rectangle = [];
        this.entity.ellipse = [];
        this.entity.image = [];
        this.entity.audio = [];
        this.entity.video = [];
    }

    return plottingObject;
})