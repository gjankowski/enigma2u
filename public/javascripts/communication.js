var socket = io.connect();
socket.on('date', function(data){
  var d = new Date(data.date);
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();
  var timeNow = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
  $('#date').text(timeNow);
});

socket.on('currentChannel', function(data){
  //console.log(data);
  var curChannel = data.e2currentserviceinformation.e2service.e2servicename;
  var curEvent = data.e2currentserviceinformation.e2eventlist.e2event[0].e2eventname;
  var nextEvent = data.e2currentserviceinformation.e2eventlist.e2event[1].e2eventname;
  var eventStart = data.e2currentserviceinformation.e2eventlist.e2event[0].e2eventstart;
  var eventRemaining = data.e2currentserviceinformation.e2eventlist.e2event[0].e2eventremaining;
  var nextEventStart = data.e2currentserviceinformation.e2eventlist.e2event[1].e2eventstart;
  var nextEventDuration = data.e2currentserviceinformation.e2eventlist.e2event[1].e2eventduration;
  var d = new Date(eventStart*1000);  // enigma returns time in seconds not in milliseconds
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();

  var eventTime = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes); // + ":" + (seconds  < 10 ? "0" + seconds : seconds);
  
  d = new Date(nextEventStart*1000);  // enigma returns time in seconds not in milliseconds
  hours = d.getHours();
  minutes = d.getMinutes();
  seconds = d.getSeconds();
  
  var nextEventTime = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes); // + ":" + (seconds  < 10 ? "0" + seconds : seconds);

  $('#current').html(curChannel + '</BR>Now:   ' + eventTime + ' - ' + curEvent + '&nbsp; &nbsp; &nbsp;...' + Math.round(eventRemaining / 60) +' min.</BR>Next: ' + nextEventTime + ' - ' + nextEvent+ '&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'  + Math.round(nextEventDuration / 60) + ' min. </BR>' );
});

function sendCommand(e2servicename,e2servicereference){
  var channelObject = {
    "e2servicename": e2servicename,
    "e2servicereference": e2servicereference 
  }
  console.log(e2servicename);
  console.log(e2servicereference);
  console.log(channelObject);
  socket.emit('channel_details', channelObject);
}

function playCurrent(){
  socket.emit('playCurrent', 1);
  console.log("Playing current");
}

function stopStream(){
  socket.emit('stopStream', 1);
  console.log("stopStream");
}

function download(path) 
{
    var ifrm = document.getElementById("frame");
    ifrm.src = path;
}