"use strict"
const fs =require("fs")
const cache = {};
const fileTimeout= {};
const memTimeout= {};
const propertiesName= [];
const timeoutInMilies= 3600000;
const limit =20;


module.exports.get = function get(str){
	if(validTimeout(str, memTimeout))
		var aux = cache[str];
	
	if(aux== undefined){
		try{
			if(validTimeout(str, fileTimeout))
				aux = fs.readFileSync("./cache/" + str + ".html");
			
		}catch(err){
			console.log("File not found:" + "./cache/" + str + ".html");
		}
	}
	
	
	return aux;
}

function validTimeout(str, src){
	return (Date.now() - src[str])< timeoutInMilies;
}

function setTimeout(str, dest){
	dest[str] = Date.now();
}

module.exports.set = function set(str, data){
	if(limit != 0 ) {
	
		if(propertiesName.length==limit){
			delete cache[propertiesName[0]];
			delete memTimeout[propertiesName[0]];
			propertiesName.splice(0,1);
		}
		
		cache[str] = data;
		propertiesName.push(str);
		setTimeout(str,memTimeout);
	}
	fs.writeFile("./cache/" + str + ".html",data, "utf8", (err)=> 
	{
		if(err)
			console.log("Problems writing in " + str);
		else 
			setTimeout(str,fileTimeout);
	})
}