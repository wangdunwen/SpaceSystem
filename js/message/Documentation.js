/**
 * Created by wangdunwen on 2016/12/20.
 */
define(function () {

    var titleWrite = '';
    var contentWrite = '';
    var documentation = function () {

        /*写入文件*/
        $("#docWrite").click(function () {

            if ($('#docNameWrite').val() === '') {
                var pop = new Popup({
                    contentType: 4,
                    isReloadOnClose: false,
                    width: 340,
                    height: 80
                });
                pop.setContent("title", "提示");
                pop.setContent("alertCon", "请输入文件名！");
                pop.build();
                pop.show();
                return;
            }
            $("#situationPanel").hide();
            titleWrite = $('#docNameWrite').val() + ".txt";
            $("#docNewDiv").show();
            $("#docContent").val("");
            console.log(titleWrite);
            $('#docTitleWrite').html(titleWrite);
            $("#escDoc").click(function () {
                $("#situationPanel").show();
                $("#docNewDiv").hide();
                console.log("esc send doc");
            });
            /*点击发送按钮*/
            $("#sendDoc").click(function () {
                contentWrite = $("#docContent").val();
                var content = {
                    "docname": titleWrite,
                    "doccontent": contentWrite
                };
                $("#situationPanel").show();
                $("#docNewDiv").hide();
                console.log("send doc");
                $.ajax({
                    type: "POST",
                    url: "/writeDoc",
                    data: content,
                    success: function (data) {
                        console.log("请求成功!");
                        var pop = new Popup({
                            contentType: 4,
                            isReloadOnClose: false,
                            width: 340,
                            height: 80
                        });
                        pop.setContent("title", "保存文档");
                        pop.setContent("alertCon", data);
                        pop.build();
                        pop.show();
                    }
                })
            });
        });
        /*读取文件*/
        $("#docRead").click(function () {
            if ($('#docNameRead').val() === '') {
                var pop = new Popup({
                    contentType: 4,
                    isReloadOnClose: false,
                    width: 340,
                    height: 80
                });
                pop.setContent("title", "提示");
                pop.setContent("alertCon", "请输入文件名！");
                pop.build();
                pop.show();
                return;
            }
            titleWrite = $('#docNameRead').val() + ".txt";
            var content = {
                "docname": titleWrite
            }
            $.ajax({
                url: "/readDoc/" + titleWrite,
                method: "GET",
                data: titleWrite,
                success: function (data) {
                    $("#situationPanel").hide();
                    $("#docOpenDiv").show();
                    console.log("解析成功");
                    $('#docTitleRead').html(titleWrite);
                    $("#docContentRead").html(data);
                    $("#closeDoc").click(function () {
                        $("#situationPanel").show();
                        $("#docOpenDiv").hide();
                    });
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(textStatus);
                    var pop = new Popup({
                        contentType: 4,
                        isReloadOnClose: false,
                        width: 340,
                        height: 80
                    });
                    if (XMLHttpRequest.status == 404) {
                        pop.setContent("title", "提示");
                        pop.setContent("alertCon", "文件名不存在！");
                        pop.build();
                        pop.show();
                    }else {
                        pop.setContent("title", "提示");
                        pop.setContent("alertCon", "未知错误，请重新输入！");
                        pop.build();
                        pop.show();
                    }
                    $("#situationPanel").show();
                    $("#docOpenDiv").hide();
                }
            })
        });
    };
    return documentation;
});