// // 模拟一个node服务，用于启动vue项目
// var express = require('express');
// var config = require('./config/index');
// var axios = require('axios');

// var app = express();
// var apiRoutes = express.Router();

// apiRoutes.get('/api/getDiscList', function(req, res){
//     let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
//     axios.get(url, {
//       headers: {
//        referer: 'http://y.qq.com',
//        host: 'c.y.qq.com'
//       },
//       params: req.query
//     }).then((response) => {
//       res.json(response.data)
//     }).catch((e) => {
//       console.log(e);
//     });
//   });
//   apiRoutes.get('/api/lyric', function(req, res) {
//     let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
//     axios.get(url, {
//       headers: {
//        referer: 'http:/c.y.qq.com/',
//        host: 'c.y.qq.com'
//       },
//       params: req.query
//     }).then((response) => {
//       var ret = response.data;
//       if (typeof ret === 'string') {
//         // MusicJsonCallback({\"retcode\":1101,\"code\":1101,\"subcode\":1101}) 将这一串字符串转换为json
//         var reg = /^\w+\(({[^()]+})\)$/;
//         var matches = ret.match(reg);
//         if (matches) {
//           ret = JSON.parse(matches[1]);
//         }
//       }
//       res.json(ret);
//       //res.json(response.data)
//     }).catch((e) => {
//       console.log(e);
//     });
//   }),
//   apiRoutes.get('/api/search', function(req, res) {
//     let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
//     axios.get(url, {
//       headers: {
//        referer: 'http:/c.y.qq.com/',
//        host: 'c.y.qq.com'
//       },
//       params: req.query
//     }).then((response) => {
//       res.json(response.data)
//     }).catch((e) => {
//       console.log(e);
//     });
//   }),
//   apiRoutes.get('/api/getDisc', function(req, res) {
//     let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
//     axios.get(url, {
//       headers: {
//        referer: 'http:/c.y.qq.com/',
//        host: 'c.y.qq.com'
//       },
//       params: req.query
//     }).then((response) => {
//       var ret = response.data;
//       if (typeof ret === 'string') {
//         // "jsonCallback({\"code\":0,\"subcode\":1,\"msg\":\"invalid referer\"})"
//         var reg = /^\w+\(({[^()]+})\)$/;
//         var matches = ret.match(reg);
//         if (matches) {
//           ret = JSON.parse(matches[1]);
//         }
//       }
//       res.json(ret);
//       res.json(response.data)
//     }).catch((e) => {
//       console.log(e);
//     });
//   })

// app.use('/api', apiRoutes);

// app.use(express.static('./dist'));

// var port = process.env.PORT || config.build.port;

// module.exports = app.listen(port, function(err) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('listening at http' + port);
// });

// var express = require('express')
// // var config = require('./config/index')
// var app = express()
// app.use(express.static('./dist'))

// var port = 3001

// module.exports = app.listen(port, function (err) {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log('Listening at http://localhost:' + port + '\n')
// })
