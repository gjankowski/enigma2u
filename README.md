# enigma2u
A tool for transcoding stream from enigma2 based box.

##Requirements
1. Linux satelite receiver with enigma2.
2. Plugin OpenWebif installed on enigma2 box.
3. A computer, can be PC with linux on the board, or any linux based hardware where is possible to compile node.js and vlc.
4. I use Odroid-U3 which is good enough to transcode SD channels.
4. Node.js platform installed on the computer. (Tested on node.js v0.12.3) 
5. Vlc installed on the computer . (Tested on vlc 2.1.6)


##Instalation

	git clone https://github.com/gjankowski/enigma2u

##Configuration

Edit file server.js and set up correct values for enigmaIP and enigmaPort to match enigma2 box settings.

	enigmaIP = '192.168.0.20'
	enigmaHttpPort = 80
	
##Start application
	node server.js
	
	(First boot of the app will take little bit longer then usually 
	as channel list database is builded.)
	
	
##Usage
Open your web browser and enter following URL
	
	http://local_IP_Address:4000
	
Where local_IP_Address it is local IP address of your computer where you run the app.
Now from the list you can to choose desired channel.
When you click the channel, it will change the channel on your enigma2 receiver and begin transcoding the stream.
After click on desired channel a playlist file will be offered to download. Open this file in your favourite player and enjoy. A playlist file contain local address to the stream.
The stream is now available under address

	http://local_IP_Address:8080
	
Now you need a player which can play stream served on URL given above. (e.g. vlc, BSPlayer ...)

When you finish watching tv on your mobile do not forget give control back to your receiver by pressing "Stop Streaming" button.

##Notes
Transcoding SD channels is working well. For transcoding HD channels is required more powerfull processor.
I run the app on Odroid-U3 microcomputer based on arm 1.7GHz Quad-Core processor and 2GByte RAM.
During transcoding SD channel processor usage is about 60%.

Bitrate of outcoming stream is about 600 kb/s ( it is about 10% bitrate of incoming stream from enigma2 box )

So after forwarding ports 4000 and 8080 on your router you can have access to your tv channels from your mobile even you are on 3G connection.

I tried this app on RaspberryPi 2 as well but outcoming stream was little bit chopped.

Bitrate values can be edited in server.js script to meet individual needs.

If your box has only one head (like my nbox ADB 5800S) during streaming you can not to change channel on your box at home because it shows that channel is recording and you can watch channels only from the same transporder.
So be carefull it can make angry your wife ;)

##Todo
For this stage application functionality is basic, however is doing what i expected. I can watch and zap channels from my mobile.
Few things i have planned to do is:

	- Option for generate playlist file with custom address, so playlist will work when you are outside your network.
	- Display current program info in line together with channel name.
	- Load picons with channel name.
	- Create appliance for VirtualBox. Everyone could test it in own environment before decide to set up dedicated computer e.g.cheap Odroid-U3
	- Option to choose between one or two headed receivers.

I don't have plans for more features at this point, except bug fixes. 



