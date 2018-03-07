"use strict";

var request = require('request');
var Artist = require('./artistSearch.js');

function Search(json)
{	
	this.artists = [];
	getArtists(json.artists.items,this.artists);
	this.total=json.artists.total;
	
	this.limit=json.artists.limit;
	this.offset=json.artists.offset;
	this.last="&offset=" +(this.total - this.limit);
	if(this.offset!=(this.total - this.limit))
		this.next="&offset="+(this.offset + this.limit);
	if(this.offset!=0)
		this.previous="&offset="+(this.offset - this.limit);
}

/*
* Recieves a array os Json Artists and an empty array
*/
function getArtists(items,artists){
	items.forEach((item) =>
		artists.push(new Artist.Artist(item))
	) 

}

function getSearch(cb,uri)
{	

	request(uri, (err,res,body) =>
	{
		if(!err && res.statusCode == 200)
		{
			cb(null,new Search(JSON.parse(body)));
		}
		else
			cb(err,null);
	});
}

module.exports = getSearch;