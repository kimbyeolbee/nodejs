var http = require('http');
var fs = require('fs');
var url = require('url'); //url이라고 하는 모듈을 사용할 것이다
var qs = require('querystring');

function templateHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function(request, response){
    var _url = request.url;
    //console.log(_url);을 하면 query string이 출력된다
    var queryData = url.parse(_url, true).query;
    //console.log(queryData);는 object
    //console.log(queryData.id);
    var pathName = url.parse(_url, true).pathname;
    //console.log(url.parse(_url, true));는 url에 대한 정보를 담고 있다
    if(pathName === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = "Welcome";
          var description = "Hello, Node.js";
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`, '');
          response.writeHead(200);
          response.end(template);
        });
      }
      else{
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`, `<a href = "/create">create</a> <a href = "/update?id=${title}">update</a>`);
            response.writeHead(200);
            response.end(template); //query string에 따라 다른 정보를 출력하는 코드
          });
        });
      }
    }
    else if(pathName === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = "WEB - create";
        var list = templateList(filelist);
        //body로 form을 받는다
        var template = templateHTML(title, list, `
          <form action = "/create_process" method = "post">
          <p><input type = "text" name = "title" placeholder = "title"></p>
          <p>
            <textarea name = "description" placeholder = "description"></textarea>
          </p>
          <p>
            <input type = "submit">
          </p>
          </form>
          `, '');
        response.writeHead(200);
        response.end(template);
      });
    }
    else if(pathName === '/create_process'){
      var body = '';
      //request는 요청할 때 웹브라우저가 보낸 정보들
      //response는 응답할 때 웹브라우저한테 보낼 정보들
      request.on('data', function(data){
        //데이터를 수신할 때마다 이 콜백 함수를 호출하도록 되어있다
        body = body + data;
      });
      request.on('end', function(){
        //정보 수신이 끝났을 때
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          //302를 받으면 redirection
          response.end();
        });
      });
    }
    else if(pathName === '/update'){
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list,
            `
            <form action = "/update_process" method = "post">
            <input type = "hidden" name = "id" value = "${title}">
            <p><input type = "text" name = "title" placeholder = "title" value = "${title}"></p>
            <p>
              <textarea name = "description" placeholder = "description">${description}</textarea>
            </p>
            <p>
              <input type = "submit">
            </p>
            </form>
            `,
            `<h2>${title}</h2><p>${description}</p>`, `<a href = "/create">create</a> <a href = "/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
    else if(pathName === '/update_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        });
      });
    }
    else{
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
