/**
 * Created by wangduwnen on 2016/12/29.
 */
define(function(){
    var socketManager = function (){
        var socket_test = window.setInterval(function(){
            if(io){
                socket = io('http://localhost:8080', {
                    'force new connection': true
                });
                socket.on("connect", function(){
                    console.log("本地socket连接成功!");
                });
                socket.on("disconnect", function(){
                    console.log("断开连接!");
                });
                window.clearInterval(socket_test);
            }
        },500);
    };
    return socketManager;
});