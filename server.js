(function () {
    "use strict";
    /*jshint node:true*/
    /*node.js web框架模块*/

    // *****************************不要加任何console.log日志*************************************************
    // *****************************否则当手机与电脑断开时会导致node进程死掉*************************************************

    var express = require('express');

    var bodyParser = require('body-parser');
    var compression = require('compression');
    var url = require('url');
    var request = require('request');
    var fs = require('fs');

    var yargs = require('yargs').options({
        'port': {
            'default': 8080,
            'description': 'Port to listen on.'
        },
        'public': {
            'type': 'boolean',
            'description': 'Run a public server that listens on all interfaces.'
        },
        'upstream-proxy': {
            'description': 'A standard proxy server that will be used to retrieve data.  Specify a URL including port, e.g. "http://proxy:8000".'
        },
        'bypass-upstream-proxy-hosts': {
            'description': 'A comma separated list of hosts that will bypass the specified upstream_proxy, e.g. "lanhost1,lanhost2"'
        },
        'help': {
            'alias': 'h',
            'type': 'boolean',
            'description': 'Show this help.'
        }
    });
    var argv = yargs.argv;

    if (argv.help) {
        return yargs.showHelp();
    }

    // eventually this mime type configuration will need to change
    // https://github.com/visionmedia/send/commit/d2cb54658ce65948b0ed6e5fb5de69d022bef941
    // *NOTE* Any changes you make here must be mirrored in web.config.
    var mime = express.static.mime;
    mime.define({
        'application/json': ['czml', 'json', 'geojson', 'topojson'],
        'model/vnd.gltf+json': ['gltf'],
        'model/vnd.gltf.binary': ['bgltf', 'glb'],
        'text/plain': ['glsl']
    });

    var app = express();
    var mysql = require('mysql');
   /* var router = express.Router();
    router.use(bodyParser.urlencoded({ extended: true }));*/
    app.use(compression());
    app.use(express.static(__dirname));

    function select(sql) {
        var promise = new Promise(function(resolve,reject) {
            var result = null;
            var mysql = require('mysql');
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '123456'
            });

            connection.connect();
            connection.query("USE space_user");
            connection.query(sql, function (err, results, fields) {
                    if (err) {
                        console.log("err");
                        reject(err);
                    }else {
                        if(results.length > 0) {
                            resolve({status: 200,name: results[0].name});
                        }else {
                            resolve({status: 400});
                        }
                    }
                }
            );
            connection.end();
        })

        return promise;
    }

    function getRemoteUrlFromParam(req) {
        var remoteUrl = req.params[0];
        if (remoteUrl) {
            // add http:// to the URL if no protocol is present
            if (!/^https?:\/\//.test(remoteUrl)) {
                remoteUrl = 'http://' + remoteUrl;
            }
            remoteUrl = url.parse(remoteUrl);
            // copy query string
            remoteUrl.search = url.parse(req.url).search;
        }
        return remoteUrl;
    }

    var dontProxyHeaderRegex = /^(?:Host|Proxy-Connection|Connection|Keep-Alive|Transfer-Encoding|TE|Trailer|Proxy-Authorization|Proxy-Authenticate|Upgrade)$/i;

    function filterHeaders(req, headers) {
        var result = {};
        // filter out headers that are listed in the regex above
        Object.keys(headers).forEach(function (name) {
            if (!dontProxyHeaderRegex.test(name)) {
                result[name] = headers[name];
            }
        });
        return result;
    }

    var upstreamProxy = argv['upstream-proxy'];
    var bypassUpstreamProxyHosts = {};
    if (argv['bypass-upstream-proxy-hosts']) {
        argv['bypass-upstream-proxy-hosts'].split(',').forEach(function (host) {
            bypassUpstreamProxyHosts[host.toLowerCase()] = true;
        });
    }

    app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'GET', 'DELETE', 'OPTIONS');
        if (req.method == 'OPTIONS') {
            res.send(200);
        } else {
            next();
        }
    })

    app.use(bodyParser.json({limit: '1mb'}))
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    //登录
    app.post('/login',function(req, res) {
        var _user = req.body;
        var id = _user.id;
        var password = _user.pwd;
        console.log("id:" + id);
        console.log("pwd:" + password);
        select('SELECT * FROM user_login WHERE id = "'+ id + '" AND password = "' + password + '";').then(function(data) {
            //session存user name和userid
            data.status > 50 ? data.url = '/index.html' : null;
            res.json(data);
            res.end();
            req.redirect("/");
        }).catch(function(err){})

    })

    app.post('/savePlotInZTE', function (req, res) {
        //保存标注信息
        fs.writeFile('plotObject.json', JSON.stringify(req.body.data), 'utf8', function (err) {
            if (err) {
                res.end(err.message);
            } else {
                res.end("保存成功");
            }
        })
    });
    app.post('/savePicture', function (req, res) {
        //保存图片
        var filename = decodeURI(req.body.filename);
        var base64data = req.body.data;
        var dataBuffer = new Buffer(base64data, 'base64');
        /*data = data.replace(/ /g, "+");*/
        fs.writeFile(filename, dataBuffer, function (err) {
            if (err) {
                res.end(err.message);
            } else {
                res.end("保存成功");
            }
        })
    })
    app.post('/saveThnPicture', function (req, res) {
        //保存图片
        var filename = decodeURI(req.body.filename);
        var base64data = req.body.data;
        var dataBuffer = new Buffer(base64data, 'base64');
        /*data = data.replace(/ /g, "+");*/
        fs.writeFile(filename, dataBuffer, function (err) {
            if (err) {
                res.end(err.message);
            } else {
                res.end("保存成功");
            }
        })
    })
    app.post('/saveAudio', function (req, res) {
        //保存图片
        var filename = decodeURI(req.body.filename);
        /*data = data.replace(/ /g, "+");*/
        fs.writeFile(filename, req.body.data, function (err) {
            if (err) {
                res.end(err.message);
            } else {
                res.end("保存成功");
            }
        })
    })
    app.post('/savePlot', function (req, res) {
        //保存标注信息
        fs.writeFile('data/files/plotObject.json', JSON.stringify(req.body.data), 'utf8', function (err) {
            if (err) {
                res.end(err.message);
            } else {
                res.end("保存成功");
            }
        })
    })
    app.post('/saveInfoEdit', function (req, res) {
        //保存情报信息
        fs.writeFile('infoObject.json', JSON.stringify(req.body.data), 'utf8', function (err) {
            if (err) {
                res.end("情报保存失败");
            } else {
                res.end("情报保存成功");
            }
        })
    })
    app.get('/readPlot', function (req, res) {
        fs.readFile('data/files/plotObject.json', function (err, data) {
            if (err) {
            } else {
                res.end(data);
            }
        })
    })
    app.get('/readPlotInZTE', function (req, res) {
        fs.readFile('plotObject.json', function (err, data) {
            if (err) {
            } else {
                res.end(data);
            }
        })
    })

    app.get('/readInfoJson', function (req, res) {
        fs.readFile('infoObject.json', function (err, data) {
            if (err) {
            } else {
                res.end(data);
            }
        })
    })

    /*文档编拟*/
    app.post('/writeDoc', function (req, res) {
        //保存文档信息
        fs.writeFile("data/files/" + req.body.docname, req.body.doccontent, 'utf8', function (err) {
            if (err) {
                res.end("文档保存失败");
            } else {
                res.end("文档保存成功");
            }
        })
    })
    app.get('/readDoc/*', function (req, res) {
        var remoteUrl = getRemoteUrlFromParam(req);
        var filename = remoteUrl.search.slice(1, remoteUrl.search.length);
        filename = decodeURI("data/files/" + filename);
        fs.readFile(filename, 'utf8', function (err, data) {
            if (err) {
                res.status(404).send('文件名不存在.');
            } else {
                res.end(data);
            }
        })
    })

    app.get('/proxy/*', function (req, res, next) {
        // look for request like http://localhost:8080/proxy/http://example.com/file?query=1
        var remoteUrl = getRemoteUrlFromParam(req);
        if (!remoteUrl) {
            // look for request like http://localhost:8080/proxy/?http%3A%2F%2Fexample.com%2Ffile%3Fquery%3D1
            remoteUrl = Object.keys(req.query)[0];
            if (remoteUrl) {
                remoteUrl = url.parse(remoteUrl);
            }
        }

        if (!remoteUrl) {
            return res.status(400).send('No url specified.');
        }

        if (!remoteUrl.protocol) {
            remoteUrl.protocol = 'http:';
        }

        var proxy;
        if (upstreamProxy && !(remoteUrl.host in bypassUpstreamProxyHosts)) {
            proxy = upstreamProxy;
        }

        // encoding : null means "body" passed to the callback will be raw bytes

        request.get({
            url: url.format(remoteUrl),
            headers: filterHeaders(req, req.headers),
            encoding: null,
            proxy: proxy
        }, function (error, response, body) {
            var code = 500;

            if (response) {
                code = response.statusCode;
                res.header(filterHeaders(req, response.headers));
            }

            res.status(code).send(body);
        });
    });

    var server = app.listen(argv.port, argv.public ? undefined : 'localhost', function () {
        if (argv.public) {
            console.log('EmbGis development server running publicly.  Connect to http://localhost:%d/', server.address().port);
        } else {
            console.log('EmbGis development server running locally.  Connect to http://localhost:%d/', server.address().port);
        }
    });

    server.on('error', function (e) {
        if (e.code === 'EADDRINUSE') {
            console.log('Error: Port %d is already in use, select a different port.', argv.port);
            console.log('Example: node server.js --port %d', argv.port + 1);
        } else if (e.code === 'EACCES') {
            console.log('Error: This process does not have permission to listen on port %d.', argv.port);
            if (argv.port < 1024) {
                console.log('Try a port number higher than 1024.');
            }
        }
        console.log(e);
        process.exit(1);
    });

    server.on('close', function () {
        console.log('EmbGis development server stopped.');
    });

    var isFirstSig = true;
    process.on('SIGINT', function () {
        if (isFirstSig) {
            console.log('EmbGis development server shutting down.');
            server.close(function () {
                process.exit(0);
            });
            isFirstSig = false;
        } else {
            console.log('EmbGis development server force kill.');
            process.exit(1);
        }
    });
    /*socket.io模块*/
    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        socket.join('myroom');
        var warning = ""; //处理警报信息
        var rescue = ""; //处理救援信息
        socket.on("warning", function (data) {
            warning = data;
            /*从其他设备接收消息，再发送给本地客户端*/
            socket.broadcast.to('myroom').emit("warningLocal", warning);
        });
        socket.on("rescue", function (data) {
            rescue = data;
            /*从其他设备接收消息，再发送给本地客户端*/
            socket.broadcast.to('myroom').emit("rescueLocal", rescue);
        });
    });

})();
