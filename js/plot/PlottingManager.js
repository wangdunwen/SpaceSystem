/**
 * Created by wangdunwen on 2017/1/17.
 */
define(['./PlottingObject',
    './PointPlotting',
    './PolylinePlotting',
    './PolygonPlotting',
    './RectanglePlotting',
    './EllipsePlotting',
    './PicturePlotting',
    './AudioPlotting',
    './VideoPlotting',
    './SavePlotting',
    './ParsePlotting'],
    function(PlottingObject,
             PointPlotting,
             PolylinePlotting,
             PolygonPlotting,
             RectanglePlotting,
             EllipsePlotting,
             PicturePlotting,
             AudioPlotting,
             VideoPlotting,
             SavePlotting,
             ParsePlotting) {
       window.plotObject = new PlottingObject();
       var point, polylinePlotting, polygonPlotting, rectanglePlotting, ellipsePlotting, picturePlotting, audioPlotting, videoPlotting, savePlotting, parsePlotting;
       var pointArray = new Array();
       var lineArray = new Array();
       var polygonArray = new Array();
       var rectangleArray = new Array();
       var ellipseArray = new Array();
       window.pictureArray = new Array();
       var videoArray = new Array();
       var audioArray = new Array();
       var pointer0 = 0;
       var EllipseId = 0;
       var RectangleId = 0;

       /*初始化弹窗*/
       var pop = new Popup({
          contentType: 4,
          isReloadOnClose: false,
          width: 340,
          height: 80
       });

   var plottingManager = function() {
      viewer.infoBox._container.style.display = "block";

      $("#line").hover(function () {
         $("#line").css("background", "#A5A5A5");
         $("#line").css("color", "#FFF");
         $("#line").css("fill", "#FFF");
      }, function() {
         $("#line").css("background", "#646464");
         $("#line").css("color", "#edffff");
         $("#line").css("fill", "#edffff");
      });
      $("#rectangle").hover(function () {
         $("#rectangle").css("background", "#A5A5A5");
         $("#rectangle").css("color", "#FFF");
         $("#rectangle").css("fill", "#FFF");
      }, function() {
         $("#rectangle").css("background", "#646464");
         $("#rectangle").css("color", "#edffff");
         $("#rectangle").css("fill", "#edffff");
      });

      /*基础图像标绘*/
      $("#basePlotPanel").click(function() {
         if( $("#basePlot").is(":hidden") ) {
            $("#basePlot").show();
         }else {
            $("#basePlot").hide();
         }
      });

      /*点标绘*/
      $("#point").click(function() {
         destroyPlotHandler();
         point = new PointPlotting(plotObject, viewer, pointArray);
         pop.setContent("title", "提示！");
         pop.setContent("alertCon", "开始点的标绘...");
         pop.build();
         pop.show();
      });

      /*线标绘*/
      $("#line").click(function() {
         destroyPlotHandler();
         lineArray[pointer0] = new Array();
         polylinePlotting = new PolylinePlotting(viewer, lineArray, pointer0, plotObject);
         pointer0++;
         pop.setContent("title", "提示！");
         pop.setContent("alertCon", "开始线的标绘...");
         pop.build();
         pop.show();
      });

      /*区域标绘*/
      $("#polygon").click(function() {
         destroyPlotHandler();
         polygonPlotting = new PolygonPlotting(viewer, polygonArray, plotObject);
         pop.setContent("title", "提示！");
         pop.setContent("alertCon", "开始区域的标绘...");
         pop.build();
         pop.show();
      });

      /*矩形标绘*/
      $("#rectangle").click(function() {
         destroyPlotHandler();
         rectanglePlotting = new RectanglePlotting('rectangle' + RectangleId++, rectangleArray, plotObject);
      });

      /*椭圆标绘*/
      $("#ellipse").click(function() {
         destroyPlotHandler();
         ellipsePlotting = new EllipsePlotting('ellipse' + EllipseId++, ellipseArray, plotObject);
      });

      /*图片数据标绘*/
      $("#picturePlot").click(function() {
         destroyPlotHandler();
         picturePlotting = new PicturePlotting(pictureArray, plotObject);
      });

      /*音频数据标绘*/
      $("#audioPlot").click(function() {
         destroyPlotHandler();
         if( $("#audioPlotPanel").is(":hidden") ) {
            $("#audioPlotPanel").show();
            audioPlotting = new AudioPlotting(audioArray, plotObject);
         }else {
            $("#audioPlotPanel").hide();
         }
      });

      /*//音频点击事件
      $("#mp3Audio").click(function () {
         audioPlotting = new AudioPlotting(audioArray, plotObject);
      });

      $("#oggAudio").click(function () {
         audioPlotting = new AudioPlotting(audioArray, plotObject);
      });

      $("#wavAudio").click(function () {
         audioPlotting = new AudioPlotting(audioArray, plotObject);
      });

      $("#wmaAudio").click(function () {
         audioPlotting = new AudioPlotting(audioArray, plotObject);
      });*/

      /*视频数据标绘*/
      $("#videoPlot").click(function() {
         destroyPlotHandler();
         if( $("#videoPlotPanel").is(":hidden") ) {
            $("#videoPlotPanel").show();
            videoPlotting = new VideoPlotting(videoArray, plotObject);
         }else {
            $("#videoPlotPanel").hide();
         }
      });

      /*$("#aviVideo").click(function () {
         videoPlotting = new VideoPlotting(videoArray, plotObject);
      })
      $("#flvVideo").click(function () {
         videoPlotting = new VideoPlotting(videoArray, plotObject);
      })
      $("#mp4Video").click(function () {
         videoPlotting = new VideoPlotting(videoArray, plotObject);
      })
      $("#mpgVideo").click(function () {
         videoPlotting = new VideoPlotting(videoArray, plotObject);
      })
      $("#wmvVideo").click(function () {
         videoPlotting = new VideoPlotting(videoArray, plotObject);
      })*/

      /*保存标绘*/
      $("#savePlot").click(function() {
         savePlotting = new SavePlotting(plotObject);
         destroyPlotHandler();
      });

      /*推送标绘*/
      $("#openPlot").click(function() {
         destroyPlotHandler();
         parsePlotting = new ParsePlotting();
      });


      /*清空标绘*/
      $("#clearAllPlot").click(function() {
         destroyPlotHandler();
         plotObject.clearAllPlottingObject();
         viewer.scene.screenSpaceCameraController.enableZoom = true;
         viewer.entities.removeAll();
         pop.setContent("title", "提示！");
         pop.setContent("alertCon", "成功清空所有标绘！");
         pop.build();
         pop.show();
      });

   };

   window.destroyPlotHandler = function() {
      $("#descriptionForEntityDiv").hide();

      pointArray = [];
      lineArray = [];
      polygonArray = [];
      pointer0 = 0;

      if (point !== undefined) {
         point.destroy(viewer);
      }
      if (polylinePlotting !== undefined) {
         polylinePlotting.destroy(viewer);
      }
      if (polygonPlotting !== undefined) {
         polygonPlotting.destroy(viewer);
      }
      if (rectanglePlotting !== undefined) {
         rectanglePlotting.destroy(viewer);
      }
      if (ellipsePlotting !== undefined) {
         ellipsePlotting.destroy(viewer);
      }
      if (picturePlotting !== undefined) {
         picturePlotting.destroy(viewer);
      }
      if (audioPlotting !== undefined) {
         audioPlotting.destroy(viewer);
      }
      if (videoPlotting !== undefined) {
         videoPlotting.destroy(viewer);
      }

   }
   return plottingManager;
});