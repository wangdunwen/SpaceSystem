/**
 * Created by WangDunWen on 2017/2/29.
 */
define(["../utils/Tools"],function (Tools) {
    var tool = new Tools();
    var flag = false;//判断是否注册回调
    var picturePlotting = function (pictureArray, plotObject) {
        var pointer = pictureArray.length;
        var that = this;
        var scene = viewer.scene;
        this.PictureHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        var ellipsoid = scene.globe.ellipsoid;
        var pictureName = ['pic(1)', 'pic(2)', 'pic(3)', 'pic(4)', 'pic(5)',
            'pic(6)', 'pic(7)', 'pic(8)', 'pic(9)', 'pic(10)',
            'pic(11)', 'pic(12)', 'pic(13)', 'pic(14)', 'pic(15)',
            'pic(16)', 'pic(17)', 'pic(18)', 'pic(19)', 'pic(20)',
            'pic(21)', 'pic(22)', 'pic(23)', 'pic(24)', 'pic(25)',
            'pic(26)', 'pic(27)', 'pic(28)', 'pic(29)', 'pic(30)',
            'pic(31)', 'pic(32)', 'pic(33)', 'pic(34)', 'pic(35)',
            'pic(36)', 'pic(37)', 'pic(38)', 'pic(39)', 'pic(40)',
            'pic(41)', 'pic(42)', 'pic(43)', 'pic(44)', 'pic(45)',];

        if( $("#picPanel").is(":hidden") ) {
            $("#picPanel").show();
        }else {
            $("#picPanel").hide();
        }

         var svgDataDeclare = "data:image/svg+xml,";
         var svgCircle = '<circle cx="10" cy="10" r="5" stroke="black" stroke-width="3" fill="red" /> ';
         // var svgCircle = '<rect id="rec" x="300" y="100" width="300" height="100" style="fill:lime"> ' +
         //    '<animate attributeName="x" attributeType="XML" begin="0s" dur="6s" fill="freeze" from="300" to="0" /> ' +
         //    '<animate attributeName="y" attributeType="XML" begin="0s" dur="6s" fill="freeze" from="100" to="0" /> ' +
         //    '<animate attributeName="width" attributeType="XML" begin="0s" dur="6s" fill="freeze" from="300" to="800" /> ' +
         //    '<animate attributeName="height" attributeType="XML" begin="0s" dur="6s" fill="freeze" from="100" to="300" /> ' +
         //    '<animateColor attributeName="fill" attributeType="CSS" from="lime" to="red" begin="2s" dur="4s" fill="freeze" />' +
         //  '</rect>';
         var svgCircle = '<rect id="recTest" x="20" y="20" width="250" height="250" style="fill:blue">' +
            '<animate attributeType="CSS" attributeName="opacity" from="1" to="0" dur="5s" repeatCount="indefinite" />' +
        '</rect>'
         var svgPrefix = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" xml:space="preserve">';
         var svgSuffix = "</svg>";
         var svgString = svgPrefix + svgCircle + svgSuffix;

         // create the cesium entity
         var svgEntityImage = svgDataDeclare + svgString;
         viewer.entities.add({
             position: Cesium.Cartesian3.fromDegrees(120, 30),
             billboard: {
                 image: svgEntityImage
             }
         });

         $("#recTest").click(function() {
            console.log("sddddd");
            $("#recTest").attr("width", "50");
         });

        $("#pic1").click(function () {
            addPicture(pictureName[0])
        });
        $("#pic2").click(function () {
            addPicture(pictureName[1])
        });
        $("#pic3").click(function () {
            addPicture(pictureName[2])
        });
        $("#pic4").click(function () {
            addPicture(pictureName[3])
        });
        $("#pic5").click(function () {
            addPicture(pictureName[4])
        });
        $("#pic6").click(function () {
            addPicture(pictureName[5])
        });
        $("#pic7").click(function () {
            addPicture(pictureName[6])
        });
        $("#pic8").click(function () {
            addPicture(pictureName[7])
        });
        $("#pic9").click(function () {
            addPicture(pictureName[8])
        });
        $("#pic10").click(function () {
            addPicture(pictureName[9])
        });
        $("#pic11").click(function () {
            addPicture(pictureName[10])
        });
        $("#pic12").click(function () {
            addPicture(pictureName[11])
        });
        $("#pic13").click(function () {
            addPicture(pictureName[12])
        });
        $("#pic14").click(function () {
            addPicture(pictureName[13])
        });
        $("#pic15").click(function () {
            addPicture(pictureName[14])
        });
        $("#pic16").click(function () {
            addPicture(pictureName[15])
        });
        $("#pic17").click(function () {
            addPicture(pictureName[16])
        });
        $("#pic18").click(function () {
            addPicture(pictureName[17])
        });
        $("#pic19").click(function () {
            addPicture(pictureName[18])
        });
        $("#pic20").click(function () {
            addPicture(pictureName[19])
        });
        $("#pic21").click(function () {
            addPicture(pictureName[20])
        });
        $("#pic22").click(function () {
            addPicture(pictureName[21])
        });
        $("#pic23").click(function () {
            addPicture(pictureName[22])
        });
        $("#pic24").click(function () {
            addPicture(pictureName[23])
        });
        $("#pic25").click(function () {
            addPicture(pictureName[24])
        });
        $("#pic26").click(function () {
            addPicture(pictureName[25])
        });
        $("#pic27").click(function () {
            addPicture(pictureName[26])
        });
        $("#pic28").click(function () {
            addPicture(pictureName[27])
        });
        $("#pic29").click(function () {
            addPicture(pictureName[28])
        });
        $("#pic30").click(function () {
            addPicture(pictureName[29])
        });
        $("#pic31").click(function () {
            addPicture(pictureName[30])
        });
        $("#pic32").click(function () {
            addPicture(pictureName[31])
        });
        $("#pic33").click(function () {
            addPicture(pictureName[32])
        });
        $("#pic34").click(function () {
            addPicture(pictureName[33])
        });
        $("#pic35").click(function () {
            addPicture(pictureName[34])
        });
        $("#pic36").click(function () {
            addPicture(pictureName[35])
        });
        $("#pic37").click(function () {
            addPicture(pictureName[36])
        });
        $("#pic38").click(function () {
            addPicture(pictureName[37])
        });
        $("#pic39").click(function () {
            addPicture(pictureName[38])
        });
        $("#pic40").click(function () {
            addPicture(pictureName[39])
        });
        $("#pic41").click(function () {
            addPicture(pictureName[40])
        });
        $("#pic42").click(function () {
            addPicture(pictureName[41])
        });
        $("#pic43").click(function () {
            addPicture(pictureName[42])
        });
        $("#pic44").click(function () {
            addPicture(pictureName[43])
        });
        $("#pic45").click(function () {
            addPicture(pictureName[44])
        });

        function addPicture(name) {
            console.log(name);
            if (that.PictureHandler.isDestroyed()) {
                return;
            }
            that.PictureHandler.setInputAction(function (event) {
                var windowPosition = getPosition(event);
                var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                /*缩略图路径*/
                var fileUrl = "resources/pic/pic_thumbnail/" + name + ".png";
                /*原图路径*/
                var fileDescription = "resources/pic/" + name + ".jpg";

                var temp = viewer.entities.add({
                    name: "picture",
                    position: cartesian,
                    HDPic: fileDescription,
                    billboard: {
                        scale: 0.3,//缩小图片比例
                        image: fileUrl
                    }
                });
                if(isTourist == true) {
                    touristLocationArr.push(tool.cartesianToCoords(ellipsoid, cartesian));
                    console.log(touristLocationArr);
                }
                $("#descriptionForEntityDiv").show();
                $("#addDescription").unbind("click").click(function() {
                    temp.description = $("#descriptionForEntity").val();
                    $("#descriptionForEntityDiv").hide();
                });
                /*保存图片*/
                var objectTemp = {
                    position: cartesian,
                    url: fileUrl, /*缩略图路径*/
                    rawUrl: fileDescription/*原图路径*/
                }
                plotObject.entity.image.push(objectTemp);
                pictureArray[pointer++] = temp;
                // 结束本次标注
                flag = false;
                that.destroy(viewer);
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            $("#picPanel").hide();
        }

    }
    picturePlotting.prototype.destroy = function (viewer) {
        var scene = viewer.scene;
        // 设置可拖动
        scene.screenSpaceCameraController.enableRotate = true;
        scene.screenSpaceCameraController.enableInputs = true;
        if (!this.PictureHandler.isDestroyed()) {
            this.PictureHandler.destroy();
        }
    };

    return picturePlotting;
});
