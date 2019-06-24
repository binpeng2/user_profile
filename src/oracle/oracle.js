// Initiate request object
const request = require("request");
const axios = require("axios");
const mysql = require('../../backend/db.js');
var fs = require('fs');
// socket server-side
var app = require('express')();
const baasUrl = "https://baas.wiccdev.org/v2/api/";
var opts = {
  key: fs.readFileSync('/etc/letsencrypt/live/backend.crazydogs.live/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/backend.crazydogs.live/fullchain.pem')
}

var server = require('https').createServer(opts,app);
// var server = require('http').createServer(app);
const io = require('socket.io')(server);
const socketPort = 5001;
let initBetId = 0;
const Promise = require("bluebird");
const randomNumber = require("random-number-csprng");

var bitcore = require('wicc-wallet-lib');
// var wiccApi = new bitcore.WiccApi({network: 'testnet'})
var wiccApi = new bitcore.WiccApi({network: 'livenet'})

// Create instance of contract object
const LuckyNumber = require("./luckyNumber.json");
const ownerAddress = "WjDxYcGuLWUm4tKZ8nz5NpUJJfMyNma9E1";

var wiccPrivateKey = process.env.WK_PK

var privateKey = bitcore.PrivateKey.fromWIF(wiccPrivateKey)
//console.log("get private key:")
//console.log(privateKey)
var address = privateKey.toAddress();
console.log("get address:")
console.log(address.toString())

const delaySec = 2
/**
* Sokect Section Starts
*/


//express middleware
app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials","true");

    next();
});

// socket.io middleware, check wallet address is valid
io.use((socket, next) => {
  let _playerAddress = socket.handshake.query.playerAddress;
  isValid(_playerAddress, next);

});

//check socket request origin
io.origins((origin, callback) => {
  if (origin !== 'https://waykidapps.com' && origin !== 'http://localhost:3000' && origin !== "http://192.168.1.3:3000") {
    return callback('origin not allowed', false);
  }
  callback(null, true);
});

//global var number of connected sockets.
var socketsCount = 0;

io.on('connection', (socket) => {
  let _playerAddress = socket.handshake.query.playerAddress;
  // console.log('a user connected: ', socket.id);
  //create room for each wallet address
  socket.join(_playerAddress);
  socketsCount++;
  socket.on('disconnect', function(){
    socket.leave(_playerAddress);
    socketsCount--;
  });

  //send newest betId, TODO
  // sending to all clients in the room
  io.in(`${_playerAddress}`).emit('welcome', 'Hi, lets play new game!');


});



//verify socket connection
function isValid(_playerAddress, next) {
  axios.post(baasUrl+"account/validateaddr",{"address":_playerAddress})
  .then(res => {
    if(res.data.data.ret){
      return next();
    }
    else{
      return next(new Error('socket authentication error'));
    }

  })
  .catch(err => {
    console.log("validateaddr error : ", err);
    return next(new Error('socket authentication error'));
  })
}

app.get('/', function(req, res){
  res.send('<h1>Welcome to LuckyNumber socket server!</h1>');
});

server.listen(socketPort, function(){
  console.log(`listening socket connection on ${socketPort}`);
});



/**
* Sokect Section Ends
*/


/**
* BetCallback Section Starts
*/

async function init(){

  initBetId = await getBetId();

  setInterval(()=>{
    startBetWatch();
    syncUpMissingBets();
  },2000)


}



function reverseString(str) {
  let temp = str.slice();
  return temp
    .split("")
    .reverse()
    .join("");
}

getInfoFromCode = (code) => {
  return {
    playerAddress: codeToChar(code.slice(0, 68)), // 地址
    betNumber: codeToNumber(code.slice(132, 140)), // 投注号码
    isUnder: codeToChar(code.slice(140, 144)) === "00" ? 1 : 0, // 开奖标志
    isOpened: codeToChar(code.slice(144, 146)), // 中奖标志
    betValue: codeToNumber(code.slice(156, 172))/1e8, // 投注金额
    payout: codeToNumber(code.slice(172, 188))/1e8, // 赔付金额
    luckyNumber: codeToNumber(code.slice(204, 212)), // 开奖号码
    timestamp: new Date()
  };
}
codeToChar = (code) =>{
    let arr = [];
    for (let i = 0; i < code.length; i += 2) {
      let temp = parseInt(code.slice(i, i + 2), 16);
      arr.push(String.fromCharCode(temp));
    }
    return arr.join("");
}

codeToNumber = (code) => {
    let reverseStr = reverseString(code),
      i = 0,
      numberStr = "",
      arr = [];
    while (i < reverseStr.length) {
      if (reverseStr[i] !== 0) {
        numberStr = reverseStr.substring(i);
        if (numberStr.length % 2 !== 0) {
          numberStr = "0" + numberStr;
        }
        numberStr = reverseString(numberStr);
        break;
      }
      i++;
    }
    for (let i = 0; i < numberStr.length; i += 2) {
      arr.push(numberStr.substr(i, 2));
    }

    return parseInt(arr.reverse().join(""), 16) || 0;
}




function getBetInfo(betId) {
  console.log("Getting bet info for betid: ", betId);
  return new Promise(resolve => {
    axios.post(baasUrl+"contract/getcontractdata",{
      "regid": LuckyNumber.regid,
      "key": betId.toString(),
      "returndatatype": "HEX"
    })
    .then(res => {

      if (res.data.data && res.data.data.value) {
          // 首字符为0则是空数据
        let data = res.data.data.value;
        if (data.indexOf("0") !== 0) {
          resolve(getInfoFromCode(data))
        }
      }
      else{
        console.log("getBetInfo res: ",res.data);
        resolve("DOSE_NOT_EXIST")
      }
    })
    .catch(err => {
      console.log("getBetInfo error : ", err);
      resolve("DOSE_NOT_EXIST")
    })
  })
}

async function insertIntoGlobalBet(settledBetData){
  mysql.query("INSERT INTO globalBetsHistory SET ? ON DUPLICATE KEY UPDATE globalBetsHistory.timestamp=?",[settledBetData, new Date()],
  (err, results, fields) => {
    if (err) {
      console.log("INSERT globalBetsHistory error",err);
    }else{
      console.log("INSERT globalBetsHistory success");
    }
  }
  )
}

function insertPendingBets(betId, playerAddress){
  var payload={
    "betId": betId,
    "timestamp":new Date()
  }

  mysql.query(
    'INSERT IGNORE INTO pendingBets SET ?',
    payload,
    (err, results, fields) => {
      if(err){
        console.log("insert pendingBets error: ",err);
      }
      else{
        if(results.affectedRows) {
          console.log("results.affectedRows: ", results);
          console.log("initBetId: ",initBetId);
          console.log("betId: ", betId);
          if(initBetId < betId) {
            console.log("should log bet==================");
            io.in(`${playerAddress}`).emit('logBet', playerAddress);
          }
          console.log('Insert pending bet successfully');
        }
      }
    }
  )
}

async function betWatcher(currBetId) {
  console.log("currBetId: ",currBetId);
  let betId = await getBetId();
  console.log("betId: ",
  betId);
  if(currBetId < betId){
    for(let i = 1; currBetId+i <= betId; i++){
      let betData= await getBetInfo(currBetId+i);
      if(betData !== "DOSE_NOT_EXIST" && betData.isOpened === "0"){
        await insertPendingBets(currBetId+i, betData.playerAddress);
      }
    }
  }
  // setTimeout(() => {
  //   console.log("startBetWatch");
  //   startBetWatch()
  // },delaySec*1000);
}

function genRandom(BetId){

  Promise.try(function() {
    return randomNumber(0, 99);
  }).then(function(number) {
    console.log("Generated random number for betId: " + BetId + ': ' + number);
    const _genRandomNum = number;
    __callback(_genRandomNum,BetId);
  }).catch({code: "RandomGenerationError"}, function(err) {
    console.log("Something went wrong for random generator!", err);
    genRandom(BetId);
  });

}

function deletePendingBets(betId, betData){
  mysql.query(
    'DELETE FROM pendingBets WHERE betId = '+ betId,
    (err, results, fields) => {
      if(err){
        console.log("delete pending bets error: ", err);
      }
      else{
        // console.log(results);
        //check if need delete
        if (betData == null) {
          console.log("Delete missing bet called more than 3 times");
          return;
        }
        else if(results.affectedRows) {
          var _playerAddress = betData.playerAddress;
          if(initBetId < betId) {
            console.log(_playerAddress);
            io.emit('logResult', betData);
          }
          betData["betId"] = betId;
          insertIntoGlobalBet(betData);
          console.log('Delete pending bet successfully');
        }
      }
    }
  )
}


async function syncUpMissingBets(){
  // console.log("syncUpMissingBets called");
  let _playerAddress;
  mysql.query(
    'SELECT * FROM pendingBets ORDER BY betId ASC ',
    async (err, results, fields) => {
      if(err){
        console.log(err);
      }
      else{
        // console.log("current number of pending bets", results.length);
        if(results.length > 0){
          for(let i = 0; i < results.length; i++){
            let _betId = results[i].betId;
            let betData= await getBetInfo(_betId);
            console.log("betData.isOpened: ",betData.isOpened);
              if(betData.isOpened === "1") {
                  console.log("Settled bet: ", _betId);
                  console.log(betData);
                  deletePendingBets(_betId, betData);
              }
              else {
                //settle again
                let now = new Date();
                now = now.getTime();
                let diff = (now-(results[i].timestamp).getTime())/1000;
                if(results[i].numberOfCallbackTriggered < 3 && diff>3){
                  console.log("settle");
                  genRandom(_betId);
                  incrementNumberOfCallbackTriggered(_betId);
                }
              }
          }
        }
      }
    }
  )
  // setTimeout(() => {
  //   syncUpMissingBets();
  // },delaySec*1000);
}

function incrementNumberOfCallbackTriggered(betId){
  mysql.query(
    'UPDATE pendingBets SET numberOfCallbackTriggered = numberOfCallbackTriggered+1, timestamp=? WHERE betId=?',[new Date(), betId],
    (err, results, fields) => {
      if(err){
        console.log(err);
      }
      else{
        console.log("Callback triggered");
      }
    }
  )
}


function integerToByte4(value){
  var bytes = new Array(3);
  for(var k=0;k<4;k++) {
    bytes[k] = value & (255);
    value = value / 256;
  }
  return bytes
}

function integerToByte8(value){
  var bytes = new Array(7);
  for(var k=0;k<8;k++) {
    bytes[k] = value & (255);
    value = value / 256;
  }
  return bytes
}


function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function betNumberToHexString(num , bytes){
  return bytes === 4 ? toHexString(integerToByte4(num)) : toHexString(integerToByte8(num))
}

function __callback(luckyNumber,betId){
  console.log("==================================================");
  axios.post(baasUrl+"block/getinfo",{
  })
  .then(res => {

    let curBlock = res.data.data.blocks-1;
    console.log("cur block: ", curBlock);
    let regAppInfo = {
      nTxType: bitcore.WiccApi.CONTRACT_TX,
      nVersion: 1,
      nValidHeight: curBlock,    // create height
      srcRegId: LuckyNumber.srcRegId,    // sender's regId
      destRegId: LuckyNumber.regid,  // app regId
      fees: 1000000,         // fees pay for miner
      value: Math.floor(Math.random()*10),              // amount of WICC to be sent to the app account
      vContract: "f0170000" + betNumberToHexString(luckyNumber,4) + betNumberToHexString(betId,8)     // contract method, hex format string
    };


    var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.CONTRACT_TX, regAppInfo)

    axios.post(baasUrl+"transaction/sendrawtx",{
      "rawtx": rawtx
    })
    .then(result => {
      console.log("__callback success", result.data);
    })
    .catch(error => {
      console.log("__callback error : ", error);
    })

  })
  .catch(err => {
    console.log("get blockinfo error : ", err);
  })


}

function getBetId(){
  return new Promise(resolve => {
    axios.post(baasUrl+"contract/getcontractdata",
      {
        "regid": LuckyNumber.regid,
        "key": "betId",
        "returndatatype": "HEX"
      }
    )
    .then(res => {
      if(res.data.data){
        currentBetId = parseInt(codeToNumber(res.data.data.value),10);
        resolve(currentBetId);
      }
      else{
        console.log("getBetId res: ",res.data);
        resolve(-1);
      }
    })
    .catch(err => {
      console.log("getBetId error : ", err);
      resolve(-1);
    })
  })
}

function startBetWatch() {
  //update latest settled betId
  mysql.query(
  'SELECT betId FROM globalBetsHistory ORDER BY betId DESC LIMIT 1',
    async (err, results, fields) => {
      if(err){
        console.log(err);
        startBetWatch();
      }
      await betWatcher(results[0].betId);
    }
  )
}

init()

setInterval(()=>{
  console.log("Socket Connections: ", socketsCount);
},2000)
/**
* BetCallback Section Ends
*/
