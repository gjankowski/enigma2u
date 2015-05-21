var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var xml2json = require("node-xml2json");
var io = require('socket.io');
var jf = require('jsonfile');
exec = require('child_process').exec;
 
//var command = vlc('file:///home/greg/node.js_projects/enigma2u/public/krucjata.mkv');

var enigmaIP = '192.168.0.6';
var enigmaHttpPort = 80;
var localIP = '192.168.0.23'
var appPort = 4000;



var currentChannelJSON;
var body = '';
var fileServices = 'public/getallservices.json'
jf.spaces = 4;

var cache = {};
var options = {
  host: '192.168.0.20',
  port: 80,
//  path: '/web/subservices',
//  path: '/web/getcurrent',
//  path: '/web/getservices',
  path: '/web/getallservices',
  method: 'GET'
};

function zapChannelAPI(sRef, sname) {
	var url = 'http://192.168.0.20/api/zap?sRef=' + escape(sRef); function test(){
		$.getJSON(url, function(result){	
			console.log('test function');
			console.log(result);
		});
		console.log('OK');
	}
}

function zapStream() {
	var url = 'http://192.168.0.20/api/zapstream?checked=true'; function test(){
		$.getJSON(url, function(result){	
			console.log('in zapStream function');
			console.log(result);
		});
		console.log('OK');
	}
}

function zapChannel(enigmaIP,enigmaHttpPort, sRef, sname){
	var http = require('http');
	var commandPath = '/api/zap?sRef=' + escape(sRef);
	//http://dreambox/web/zap?sRef={servicereference}
	//commandPath = '/web/zap?sRef=' + escape(sRef);
	console.log(commandPath);
	var options = {
	  host: enigmaIP,
	  port: enigmaHttpPort,
	  path: commandPath,
	  method: 'GET'
	};

	callback = function(response) {
	  
	  var str = '';
	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
		str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
		console.log('Zap to channel >' + sname + '< respond ' + str);
		getStreamDetails(enigmaIP,enigmaHttpPort, sRef, sname);
	  });
	}
	http.request(options, callback).end();
}

var launchVLC = function(source,transcodeStr) {
	var StreamCommand = '';
	StreamCommand = "/usr/bin/vlc -deamon -vvv " + source + transcodeStr;
	console.log('StreamCommand ' + StreamCommand);

   var command = "vlc --daemon -vvv " + source + " --sout '#transcode{vcodec=h264,acodec=mp3,vb=256,ab=64,scale=0.5,channels=2}:standard{access=http,mux=ts,url=192.168.0.23:8080}'";
    var child = exec(command, function(err, stdout, stderr) {
        if (err) {
            console.log(err);
            console.log(stderr);
        }
    });
};


function getStreamDetails(enigmaIP,enigmaHttpPort, sRef, sname){
	console.log('enigmaIP ' + enigmaIP + ' enigmaHttpPort ' + enigmaHttpPort + ' sRef ' + sRef + ' sname ' + sname);
	var http = require('http');
	var transcodeString = " --sout '#transcode{vcodec=h264,acodec=mp3,vb=256,ab=64,scale=0.5,channels=2}:standard{access=http,mux=ts,url=192.168.0.4:8080}'";
	var commandPath = '/web/stream.m3u?ref=' + sRef + '&name=' + escape(sname);
	//commandPath=escape(commandPath);
	console.log('0x01 ' + commandPath);
	var options = {
	  host: enigmaIP,
	  port: enigmaHttpPort,
	  path: commandPath,
	  method: 'GET'
	};

	callback = function(response) {
	  
	  var str = '';
	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
		str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
		console.log('Stream info of channel >' + sname + '< respond ' + str);
		var source = str.substr(str.indexOf('http://'));
		source = source.replace(/(\r\n|\n|\r)/gm,"");	// remove all signs of end of line
		console.log('source ' + source);
		console.log('transcodeString' + transcodeString);
		launchVLC(source, transcodeString);
	  });
	}
	http.request(options, callback).end();
}


var killVlc = function() {
    try {
        //var cmd = 'tasklist /fi "ImageName eq vlc.exe" /fo csv /nh';
        var cmd = 'killall -9 vlc';
        var child = exec(cmd, function(err, stdout, stderr) {
            if (err) {
                console.log(err);
                console.log(stderr);
            }
        });
    } catch (ex) {
        console.log("kill catch");
    }
};


var req = http.request(options, function(res) {
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    body += chunk;
  });
  
  res.on('end', function () {
    var json = xml2json.parser( body );
    jf.writeFile(fileServices, json, function(err) {
      if (err) {
        console.log(err)
      }
    })
	console.log('File ' + fileServices + ' is now saved');
  });

});

function checkForFile(fileName,callback){
    var retValue;
	fs.exists(fileName, function (exists) {
        if(exists)
        {
			retValue=1;
            callback(retValue);
        }else
        {
            fs.writeFile(fileName, {flag: 'wx'}, function (err, data) 
            { 
                retValue=0;
				callback(retValue);
            })
        }
    });
}

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Błąd 404: plik nie został znaleziony.');
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}

function saveFile(filename,data){
	var fs = require('fs');
	fs.writeFile(filename, data, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("The file " + filename + " creating . . .    OK");
	});

}

function exeCommand(data,output){
var exec = require('child_process').exec;

var e2servicename = data.e2servicename;
var e2servicereference = data.e2servicereference;
console.log(e2servicename);
console.log(e2servicereference);

exec('ls -l', function (error, stdout, stderr) {
  output(stdout);
  // output is in stdout
});
}


function askEnigmaToDo(enigmaIP,enigmaHttpPort,commandPath){
	var http = require('http');
	var options = {
	  host: enigmaIP,
	  port: enigmaHttpPort,
	  path: commandPath,
	  method: 'GET'
	};

	callback = function(response) {
	  
	  var str = '';
	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
		str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	    currentChannelJSON = xml2json.parser( str );
		//console.log(currentChannelJSON);
		//console.log(currentChannelJSON.e2currentserviceinformation.e2service.e2servicereference);
		//console.log(currentChannelJSON.e2currentserviceinformation.e2service.e2servicename);
		//console.log(currentChannelJSON.e2currentserviceinformation.e2eventlist.e2event[0].e2eventname);
		//console.log(currentChannelJSON.e2currentserviceinformation.e2eventlist.e2event[1].e2eventname);		
	  });
	}
	http.request(options, callback).end();
}

var server = http.createServer(function(request, response) {
  var filePath = false;
  if (request.url == '/') {
    filePath = 'public/index.html';
	console.log('new connection to the server');		
	askEnigmaToDo(enigmaIP,enigmaHttpPort,'/web/getcurrent');
  } else {
    filePath = 'public' + request.url;
  }
  var absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});


checkForFile(fileServices,function(ret){
	console.log('Checking for File ' + fileServices);
	if (ret == 0) {

		console.log('Start dowlnoad ' + fileServices + ' file');
		req.on('error', function(e) {
			  console.log('problem with request: ' + e.message);
		});
		req.write('data\n'); //this line prints first, while the request and the content 
    	//printing happens a bit slow as its an internet call.
		//console.log(body);
		req.end();  

	}
	if ( ret == 1 ){
		console.log('File ' + fileServices + ' exist');
	}
});


server.listen(4000, function() {
  console.log("Serwer nasłuchuje sobie na porcie 4000.  ");
  saveFile("public/stream.m3u","#EXTVLCOPT--http-reconnect=true\nhttp://" + localIP + ":8080\n");
});

var io = io.listen(server);
io.set('log level', 1);
var n=0;
io.sockets.on('connection', function(socket){
    //send data to client
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);

    setInterval(function(){		
		if ( currentChannelJSON != ''){
			socket.emit('currentChannel', currentChannelJSON);
		}
		if ( n== 60){
			n = 0;
			askEnigmaToDo(enigmaIP,enigmaHttpPort,'/web/getcurrent');
		}
		n +=1;
    }, 1000);	

	socket.on('playCurrent', function(data){
		if ( data == 1 ){

			exec('killall vlc', function (error, stdout, stderr) {
  				////output(stdout);
  				console.log("test2");
  				// output is in stdout
			});

			//zapChannel(enigmaIP, enigmaHttpPort, currentChannelJSON.e2currentserviceinformation.e2service.e2servicereference, currentChannelJSON.e2currentserviceinformation.e2service.e2servicename);	
			var ref = currentChannelJSON.e2currentserviceinformation.e2service.e2servicereference;
			var command = "vlc --daemon -vvv 'http://" + enigmaIP + ":8001/" + ref + "' --sout '#transcode{vcodec=h264,acodec=mp3,vb=256,ab=64,scale=0.5,channels=2}:standard{access=http,mux=ts,url=192.168.0.23:8080}'";
			console.log(command);
			child = exec(command, function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});	
		}
		askEnigmaToDo(enigmaIP,enigmaHttpPort,'/web/getcurrent');	
	});
	
	socket.on('stopStream', function(data){
		if ( data == 1 ){

			var ref = currentChannelJSON.e2currentserviceinformation.e2service.e2servicereference;
			var command = "killall vlc";
			console.log(command);
			child = exec(command, function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});	
		}
		askEnigmaToDo(enigmaIP,enigmaHttpPort,'/web/getcurrent');	
	});
	
	//recieve client data
	socket.on('channel_details', function(data){

		exec('killall vlc', function (error, stdout, stderr) {
		  ////output(stdout);
		  console.log("test")
		  // output is in stdout
		});

		//console.log(data);
		//console.log(data);
		var sname = data.e2servicename;
		var sRef = data.e2servicereference;
		//
		
		zapChannel(enigmaIP, enigmaHttpPort, sRef, sname);
		//zapStream();
		//exeCommand(data,function(output){
		// console.log(output);
		//});
		//launchVlc();	
//		var command = vlc('file:///home/greg/node.js_projects/enigma2u/public/krucjata.mkv').format('ogg').videoCodec('theo').audioCodec('vorb').addOption('--sout #transcode{vcodec=h264,acodec=mp3,vb=256,ab=64,scale=0.5,channels=2}:standard{access=http,mux=ts,url=192.168.0.7:8888}');
//		console.log(command);
		askEnigmaToDo(enigmaIP,enigmaHttpPort,'/web/getcurrent');	
	});
});




