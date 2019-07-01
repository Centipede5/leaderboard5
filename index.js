var Leaderboard5 = function(options){
    this.file = options.file;
    this.maxlen = options.maxlen;
    this.delimeter = options.delimeter;
    this.sortby = options.sortby;
    this.sortof = options.sortof;
    console.log(this.sortof)
    this.key = options.key;
    this.fs = require('fs');
    this.express = require('express');
    var obj = this;
    var fs = this.fs;
    var express = this.express;
    if(options.createReqSystem){
        const app = express();
        const port = options.port;
        app.use((req,res,next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET');
            next();
        });
        app.get('/getleaderboard', function(req, res) {
            obj.toJSON(function(a){
                res.send(JSON.stringify(a));
            });
        });
        app.get('/sendscore', function(req, res) {
            if(req.query.key==obj.key){
                obj.addPlay(JSON.parse(req.query.data),function(){
                    res.send("you got on the leaderboard!")
                },function(){
                    res.send("sorry, you did not get on the leaderboard")
                });
            }
        });
        app.listen(port, () => console.log(`leaderboard server is listening on port ${port}!`));
    }
    this.rewrite = function(text,callback){
        var callback = callback||function(){};
        fs.writeFile(obj.file, text, callback);
    }
    this.clear = function(callback){
        var callback = callback||function(){};
        fs.writeFile(obj.file, "", callback);
    }
    this.getContents = function(callback){
        this.fs.readFile(obj.file, function(err, buf) {
            callback(buf.toString());
        });
    }
    this.addJSON = function(json,index,callback){
        obj.getContents(function(buf){
            var compl = buf.split(obj.delimeter);
            if(compl[0]==""){
                compl.pop();
            }
            compl.splice(index, 0, JSON.stringify(json));
            obj.rewrite(compl.join(obj.delimeter),function(){
                callback();
            })
        });
    }
    this.cullAndWrite = function(succeeded,callbacksucceed,callbackfail){
        obj.getContents(function(buf){
            var compl = buf.split(obj.delimeter);
            if(compl[0]==""){
                compl.pop();
            }
            while(compl.length>obj.maxlen){
                compl.pop();
            }
        
            obj.rewrite(compl.join(obj.delimeter),function(){
                if(!succeeded){
                    callbackfail();
                }else{
                    callbacksucceed();
                }
            })
        });
    }
    this.addPlay = function(json,callbacksucceed,callbackfail){
        var callbackfail = callbackfail||function(){};
        obj.getContents(function(buf){
            var compl = buf.split(obj.delimeter);
            if(compl[0]==""){
                compl.pop();
            }
            var len = compl.length;
            var succeeded = false;
                for(var i=0;i<compl.length;i++){
                    var compljson = JSON.parse(compl[i]);
                    if(obj.sortof){
                        console.log("ree")
                        if((json[obj.sortby]>compljson[obj.sortby])||
                            ((json[obj.sortby]>=compljson[obj.sortby])&&obj.favornewest)){
                            succeeded = true;
                            obj.addJSON(json,i,function(){
                                obj.cullAndWrite(true,callbacksucceed,callbackfail);
                            });
                            break;
                        }
                    }else{
                        console.log("ree2")
                        if((json[obj.sortby]<compljson[obj.sortby])||
                            ((json[obj.sortby]<=compljson[obj.sortby])&&obj.favornewest)){
                            succeeded = true;
                            obj.addJSON(json,i,function(){
                                obj.cullAndWrite(true,callbacksucceed,callbackfail);
                            });
                            break;
                        }
                    }
                }
            if(!succeeded&&len<obj.maxlen){
                succeeded = true;
                obj.addJSON(json,len,function(){
                    obj.cullAndWrite(true,callbacksucceed,callbackfail);
                });
            }else if(!succeeded){
                obj.cullAndWrite(false,callbacksucceed,callbackfail);
            }
            
        });
    }
    this.toJSON = function(callback){
        obj.getContents(function(buf){
            var compl = buf.split(obj.delimeter);
            for(var i=0;i<compl.length;i++){
                compl[i] = JSON.parse(compl[i]);
            }
            callback(compl);
        });
    }
}
Leaderboard5.LOWEST = false;
Leaderboard5.HIGHEST = true;
exports.Leaderboard5 =  Leaderboard5;