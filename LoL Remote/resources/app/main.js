const electron = require('electron')
// Module to control application life.
const app = electron.app

const { ipcMain } = require('electron');
	var my_http = require('http');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
var fs = require('fs');
const path = require('path')
const url = require('url')
const {Menu, Tray} = require('electron')

let mainWindow

var _tray = null

var http = require('http');

const https = require('https');
var ps = require('ps-node');
const WSS = require('ws');
var appPort = 0;
var appToken = 0;

function getRiot(method,api,cb){
	//"https://@127.0.0.1:"+appPort+"/"+api
	https.request({method: method,hostname: "127.0.0.1",port: appPort,rejectUnauthorized: false,auth: "riot:"+appToken,path: api}, (resp) => {
		
		console.log('statusCode:', resp.statusCode);
	if(resp.statusCode==200){
	  let data = '';

	  // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });

	  // The whole response has been received. Print out the result.
	  resp.on('end', () => {
	    cb(JSON.parse(data));
	  });
	}else{
		cb({responseCode: resp.statusCode});
	}

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	}).end();
}


function showAlert(){
	_tray.displayBalloon({title:'League of Legends conectado',content: 'Seja bem-vindo '});
}

var _CLIENT = null;

function sendWs(data){
	try{
		_CLIENT.send(JSON.stringify(data));
	}catch(e){
		
	}
}

 function init(){
	console.log("client found");
	
	const wss = new WSS.Server({ port: 10808 });


	wss.on('connection', function connection(ws,req) {
		
		_CLIENT = ws;
		
		ws.on('message', function incoming(message) {
			var CMD = JSON.parse(message);
			
			switch(CMD[0]){
				case "ready-check":
					getRiot('POST','/lol-matchmaking/v1/ready-check/'+CMD[1],function(d){
								
								});
				break;
			}
		});

	});
	
	
	getRiot("GET","/lol-summoner/v1/current-summoner",function(d){
		
		showAlert();
		

		console.log(d.displayName);
		
		
		const contextMenu = Menu.buildFromTemplate([
			{label: d.displayName,enabled: false},
			{label: '',type: 'separator'},
			{label: 'Sair',click: function(){  app.quit() }}
		])
		_tray.setContextMenu(contextMenu);
		
		
			console.log("https://riot:"+appToken+"@127.0.0.1:"+appPort+"/");
	 
			let ws = new WSS("wss://riot:"+appToken+"@127.0.0.1:"+appPort+"/",{rejectUnauthorized: false}, {
			  origin: "https://127.0.0.1:"+appPort,
			  Host: "127.0.0.1:"+appPort});

		
			  
			ws.on('error', (err) => {
			  console.log(err);
			});

			var actNow = false;
			var actConfirm = [];
			
			ws.on('message', (_msg) => {
				if(_msg){
					try{
						var msg = JSON.parse(_msg);
					}catch(e){
						console.log(e);
					}
					msg = msg[2];
					
					
					switch(msg.uri){
						case '/lol-matchmaking/v1/ready-check':
						
							console.log(msg);
							
							sendWs(["ready-check",msg.data]);
							
							
							/*if(msg.data.playerResponse=='None'){
								getRiot('POST','/lol-matchmaking/v1/ready-check/accept',function(d){
								
								});
							}*/
							
						
						/*{ data:
   { declinerIds: [],
     dodgeWarning: 'None',
     playerResponse: 'Declined',
     state: 'InProgress',
     suppressUx: false,
     timer: 9 },
  eventType: 'Update',
  uri: '/lol-matchmaking/v1/ready-check' }*/
						break;
						case '/lol-champ-select/v1/session':
							console.log("Champ-Select: "+msg.eventType);
						
							//console.log(msg.data.actions)
						break;
						case "/lol-matchmaking/v1/search":
						
						//console.log(msg);
						
							console.log(msg);
							if(msg.eventType == 'Delete'){								
								sendWs(["unqueue"]);
							}else if(msg.eventType == 'Update'){
							
								sendWs(["queue",msg.data]);
							}
						/*{ data:
							   { dodgeData: { dodgerId: 0, state: 'Invalid' },
								 errors: [],
								 estimatedQueueTime: 180.00001525878906,
								 isCurrentlyInQueue: true,
								 lobbyId: '',
								 lowPriorityData:
								  { bustedLeaverAccessToken: '',
									penalizedSummonerIds: [],
									penaltyTime: 0,
									penaltyTimeRemaining: 0 },
								 queueId: 420,
								 readyCheck:
								  { declinerIds: [],
									dodgeWarning: 'None',
									playerResponse: 'None',
									state: 'Invalid',
									suppressUx: false,
									timer: 0 },
								 searchState: 'Searching',
								 timeInQueue: 40 },
							  eventType: 'Update',
							  uri: '/lol-matchmaking/v1/search' }*/
						break;
						case '/lol-champ-select/v1/pickable-champions':
							/*
							{ data:
   { championIds:
      [ 36,
        1,
        29,
        10,
        145,
        11,
        75,
        114,
        13,
        78,
        133,
        15,
        16,
        54,
        18,
        516,
        20,
        19,
        22,
        27,
        5,
        32,
        86,
        4,
        420,
        40,
        429,
        61 ] },
  eventType: 'Update',
  uri: '/lol-champ-select/v1/pickable-champions' }
							*/
						break;
						
						case '/lol-lobby-team-builder/champ-select/v1/bannable-champions':
							/*
							{ data:
   { championIds:
      [ 1,
        2,
        3,
        4,
        516,
        5,
        517,
        6,
        518,
        7,
        8,
        9,
        10,
        266,
        267,
        12,
        268,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        25,
        26,
        27,
        28,
        29,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        555,
        44,
        45,
        48,
        50,
        51,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        64,
        67,
        68,
        69,
        72,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        82,
        83,
        84,
        85,
        86,
        89,
        90,
        91,
        92,
        96,
        98,
        99,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        110,
        111,
        112,
        113,
        114,
        115,
        117,
        ... 34 more items ] },
  eventType: 'Update',
  uri: '/lol-lobby-team-builder/champ-select/v1/bannable-champions' }
							*/
						break;
					}

				
				}
				
				
				
			
			});
			
			ws.on('open', () => {
				ws.send('[5, "OnJsonApiEvent"]');
				
			});
			
	});
 }

 function findLoL(){
	 
	ps.lookup({
		command: 'LeagueClientUx.exe'
	}, function(err, resultList ) {
		if (err) {
			throw new Error( err );
		}
				
		if(resultList.length==0){
			findLoL();
		}

		resultList.forEach(function( process ){
			if( process ){
				var args = process.arguments;
				for(var a in args){
					var tmp = args[a].split("=");
					if(tmp[0]=="--app-port"){
						appPort = tmp[1];
					}
					if(tmp[0]=="--remoting-auth-token"){
						appToken = tmp[1];
					}
				}
			
	
				init();
			}
					
					
		});
	});
}



function createWindow () {
	
	_tray = new Tray('icon.ico')
	const contextMenu = Menu.buildFromTemplate([
			{label: 'Localizando League of Legends',enabled: false},
			{label: '',type: 'separator'},
		{label: 'Sair',click: function(){  app.quit() }}
	])
	_tray.setContextMenu(contextMenu);
	
	_tray.displayBalloon({title:'Procurando League of Legends',content: 'Certifique-se de estar com o launcher do League of Legends em execução.'})
	
	findLoL();
					
}



app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
