"use strict"

var request = require('request');
var Track = require('./trackSearch.js');

function Album(json,user)
{
	this.name = json.name;
	this.date = json.release_date;
	this.id=json.id;
	this.artist = json.artists[0].name;
	
	this.tracks = [];
	getTracks(json.tracks.items,this.tracks,user);
	
	if(json.images[1])
		this.img=json.images[1].url
}

function getTracks(items,tracks,user)
{
	items.forEach((item) =>
	{
		tracks.push(new Track.Track(item,user));
	})
}

function getAlbum(cb,uri,req)
{	
	request(uri, (err,res,body) =>
	{
		if(!err && res.statusCode == 200)
		{
			cb(null,new Album(JSON.parse(body),req));
		}
		else
			cb(err,null);
	});
}

module.exports.getAlbum = getAlbum;
module.exports.Album = Album;