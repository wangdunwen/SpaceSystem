/**
 * Created by wangdunwen on 2017/3/15.
 */
define(function () {
    var savePlotting = function (plotObject) {
        /**
         * 调用nodejs保存标注
         */
        $.ajax({
            type: "POST",
            url: "/savePlot",
            data: {data: JSON.stringify(plotObject.entity)},
            success: function (data) {
                var pop = new Popup({
                    contentType: 4,
                    isReloadOnClose: false,
                    width: 340,
                    height: 80
                });
                pop.setContent("title", "保存态势");
                pop.setContent("alertCon", data);
                pop.build();
                pop.show();
            }
        })
        plotObject.clearAllPlottingObject();

    }
    return savePlotting;
})