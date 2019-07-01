# Leaderboard5

Leaderboard5 is a javascript library for making leaderboards for games. See/clone a working example of the:

server [here](https://glitch.com/edit/#!/imaginary-sapphire)

client [here](https://dramatic-birthday.glitch.me/)

## Installation

Use the package manager [npm](https://www.npmjs.com) to install leaderboard5.

```bash
npm i leaderboard5
```

## Usage

### Standard usage (for deploying)

```javascript
var l = require("leaderboard5");
var config = {
    file:"ree.txt",                 // file where scoreboard is kept
    delimeter:"\n",                 // delimeter seperating values
    favornewest:true,               // true if newer names should show up before older names IF the score is the same
    maxlen:10,                      // length of scoreboard 
    sortby:"score",                 // the JSON property to sort by
    sortof:l.Leaderboard5.HIGHEST,  // Leaderboard5.LOWEST to sort lowest first (e.g. fastest time), Leaderboard5.HIGHEST to sort highest first (e.g. highest score)
    createReqSystem:true,          // true if you want an express request system to be created (/getleaderboard for json leaderboard, /sendscore?data=json&?key=key)
    key:"03b77154-acdd-4af8-a0ab-7804dba11244",// Key needed to write to leaderboard
    port:8080,                      // port to run express on
}
var allTimeLeaderBoard =new l.Leaderboard5(config);
```

### To submit score (on game server)
```javascript
const request = require('request');
function sendscore(name,score){
    request('http://myurl.com/sendscore?data='+JSON.stringify({name:name,score:score})+"&key=03b77154-acdd-4af8-a0ab-7804dba11244", function(err, res, body) {  });
}
```

### To get leaderboard (on client)
```javascript
// simple Http Client
var HttpClient=function(){this.get=function(t,e){var n=new XMLHttpRequest;n.onreadystatechange=function(){4==n.readyState&&200==n.status&&e(n.responseText)},n.open("GET",t,!0),n.send(null)}};

var client = new HttpClient();
var url = "https://myurl.com";
client.get(url+"/getleaderboard",function(str){
    var jsona = JSON.parse(str);
    alert(str);
})

```

### Basic usage (testing, no req system)

```javascript
var l = require("leaderboard5");
var config = {
    file:"ree.txt",                 // file where scoreboard is kept
    delimeter:"\n",                 // delimeter seperating values
    favornewest:true,               // true if newer names should show up before older names IF the score is the same
    maxlen:10,                      // length of scoreboard 
    sortby:"score",                 // the JSON property to sort by
    sortof:l.Leaderboard5.HIGHEST,  // Leaderboard5.LOWEST to sort lowest first (e.g. fastest time), Leaderboard5.HIGHEST to sort highest first (e.g. highest score)
    createReqSystem:false,          // true if you want an express request system to be created (/getleaderboard for json leaderboard, /sendscore?data=json&?key=key)
    key:"123456",                   // Key needed to write to leaderboard
    port:8080,                      // port to run express on
}
var allTimeLeaderBoard =new l.Leaderboard5(config);
allTimeLeaderBoard.clear(function(){
    allTimeLeaderBoard.addPlay({name:"albert",score:5},function(){
    });
});
```



## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)