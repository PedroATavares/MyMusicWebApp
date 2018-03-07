"use strict"

const ComponentSupplier = require('./../views/htmlComponents/componentSupplier.js');
var request = require('request');

function Track(json,user)
{
	this.nr = json.track_number;
	this.name = json.name;
	this.length = convertTime(json.duration_ms);
	this.id = json.id;
	this.preview = json.preview_url;
	
	if(user!=undefined)
	{
		this.playlists = user.playlists;
		this.sharedPlaylists = user.sharedPlaylists;
		this.owner=user.username;
	}
}

function getTrack(cb,uri)
{	
	
	request(uri, (err,res,body) =>
	{
		if(!err && res.statusCode == 200)
		{
			cb(null,new Track(JSON.parse(body)));
		}
		else
			cb(err,null);
	});
}

function convertTime(ms)
{
	var seconds=Math.floor((ms/1000)%60);
	var minutes=Math.floor((ms/(1000*60))%60);
	
	return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds) + 's';	
}

module.exports.Track = Track;
module.exports.getTrack = getTrack;