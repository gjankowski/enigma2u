function processAllServices1(){
//   console.log('to jest log');
//  var props = 'e2service.e2servicename';

   

$.getJSON( "getallservices.json", function( data ) {
//  console.log(getObjects(data,'e2bouquet',''));
//  alert('The value of ' + props + ' is ' + findProp(data, props));
  var items = [];
  var bouquetName;
//  traverse_it(data);
var retKey0, retVal0;
var retKey1, retVal1;
var retKey2, retVal2;
var retKey3, retVal3;
var retKey4, retVal4;
var retKey5, retVal5;
var retKey6, retVal6;
var tempStr;
var i=0;
$.each( data, function( key0, val0 ) {
	retKey0 = key0;
	retVal0 = val0;
	if  (typeof val0 == 'object'){
		$.each( val0, function( key1, val1 ) {
			retKey1 = key1;
			retVal1 = val1;
			if  (typeof val1 == 'object'){
				//@@@@@@@@@@@@@@@@
				$.each( val1, function( key2, val2 ) {
					retKey2 = key2;
					retVal2 = val2;
					//~~~~~~~~~~~~~~~~~
					if  (typeof val2 == 'object'){
						bouquetName =''
						$.each( val2, function( key3, val3 ) {
							if (typeof val3 != 'object') bouquetName = val3;
							retKey3 = key3;
							retVal3 = val3;
							//#############
							if  (typeof val3 == 'object'){
								$.each( val3, function( key4, val4 ) {
									retKey4 = key4;
									retVal4 = val4;
									//#############
									if  (typeof val4 == 'object'){
										$.each( val4, function( key5, val5 ) {
											retKey5 = key5;
											retVal5 = val5;
											//#############
											if  (typeof val5 == 'object'){
												i = i + 1;
												tempStr='';
												$.each( val5, function( key6, val6 ) {
													tempStr = tempStr + 'key6 >' + key6 + '< val6 >' + val6 + '< '
													//console.log('val6 >' + val6 + '<');
												});
												console.log('key0 >' + key0 + '< ' + 'key1 >' + key1 + '< ' + 'key2 >' + key2 + '< ' + 'key3 >' + bouquetName + '< ' + 'key4 >' + key4 + '< ' + 'key5 >' + key5 + '< ' + tempStr + i);	
											} else console.log(val5);
											//#############
										});
									} else console.log(val4);
									//#############
								});
							} //else console.log(val3);
							//#############
						});
					} else console.log(val2);
					//~~~~~~~~~~~~~~~~~~
				});
				//@@@@@@@@@@@@@@@@@
			} else console.log(val1);
		});
	} else console.log(val0);
});

});
 //##################
}

function processAllServices(){
//   console.log('to jest log');
//  var props = 'e2service.e2servicename';

   

$.getJSON( "getallservices.json", function( data ) {
//  console.log(getObjects(data,'e2bouquet',''));
//  alert('The value of ' + props + ' is ' + findProp(data, props));
  var items = [];
//  traverse_it(data);
  $.each( data.e2servicelistrecursive.e2bouquet[0], function( key, val ) {
  console.log('key >' + key + '<');
  console.log('val >' + val + '<');
  if  (key == '2e2servicelist'){
    console.log('val is object');
    console.log(val.e2service);
	//@@@@@@@@@@@@@@@@
    $.each( val, function( key1, val1 ) {
        console.log('     key1 >' + key1 + '<');
        console.log('     val1 >' + val1 + '<');
		//~~~~~~~~~~~~~~~~~
        if  (key1 == 'e2service'){
			$.each( val1, function( key2, val2 ) {
                console.log('     key2 >' + key2 + '<');
				console.log('     val2 >' + val2 + '<');
				//#############
				if  (key2 == '112'){
					$.each( val2, function( key3, val3 ) {
						console.log('     key3 >' + key3 + '<');
						console.log('     val3 >' + val3 + '<');
					});
				}	
				//#############
			});
        }
		//~~~~~~~~~~~~~~~~~~
    });
	//@@@@@@@@@@@@@@@@@
  }
  });

});
 //##################
}


function recursiveGetProp(obj, lookup, callback) {
    for (property in obj) {
        if (property == lookup) {
            callback(obj[property]);
        } else if (obj[property] instanceof Object) {
            recursiveGetProp(obj[property], lookup, callback);
        }
    }
}

function createList(data){
	var html = '';
	var bouquetName ='';
	recursiveGetProp(data, 'e2bouquet', function(obj) {
		if( Object.prototype.toString.call( obj ) === '[object Array]' ) {
			//alert( 'Array!' );
			//if we are here we have in object list of bouquets objects
			// in my case i have 20 bouquets obj.length equal 20
			//console.log(obj.length);
			for ( i in obj ) {
				//console.log(obj[i]);
				//bouquetName = obj[i].e2servicename;
				html += '<div data-role="collapsible" data-inset="true" data-id='+ i +'><h3>'+obj[i].e2servicename+'</h3><ul data-role="listview" data-inset="true">';
				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				recursiveGetProp(obj[i], 'e2service', function(objChannels) {
				if( Object.prototype.toString.call( objChannels ) === '[object Array]' ) {
					//console.log("Hurray!!!!   Array!" );
					for ( i in objChannels ) {
						html += '<a href=javascript:download("stream.m3u") style"padding: 0px 10px 0px 30px;  word-wrap: normal; display: inline-block;"><div style="background-color:#eeeeee; padding: 20px; border-radius: 10px; border: 2px solid #eeeeFF;" >' + '<li class="row" onclick="sendCommand(\''+ objChannels[i].e2servicename +'\',\'' + objChannels[i].e2servicereference +'\');">'+ objChannels[i].e2servicename +'</li></div></a>';
						//console.log(objChannels[i]); 
						//console.log(objChannels[i].e2servicereference);
						//console.log(objChannels[i].e2servicename);
					}
				}
				//console.log(objChannels);
				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				});
				html += '</ul></div>';
			}
		}
	//console.debug(obj);
	});



//'''''''''''''''''''''''''
    
    return html;
}

$(document).ready(function () { // load json file using jquery ajax
$.getJSON( "getallservices.json", function( data ) {
	var menulistitem = createList(data);    
	//console.log(menulistitem);
	
	$('#menu-content').empty().append(menulistitem);
	$('div[data-role=collapsible]').collapsible();
	$('div ul').listview();

});
	//	processAllServices1();
	
});

