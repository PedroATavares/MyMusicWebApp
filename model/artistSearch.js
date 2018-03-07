"use strict"

var request = require('request');
const Albums = require('./albumsSearch.js');

function Artist(json)
{
	this.name = json.name;
	this.popularity = json.popularity;
	this.genres = json.genres.slice(0,3);
	this.followers = json.followers.total;
	this.id = json.id;
	this.albums;
	
	if(json.images[0])
		this.img=json.images[0].url;
}

function getArtist(cb,uri)
{	
	console.log('done');

	request(uri, (err,res,body) =>
	{
		if(!err && res.statusCode == 200)
		{
			cb(null,new Artist(JSON.parse(body)));
		}
		else
			cb(err,null);
	});
}

module.exports.getArtist = getArtist;
module.exports.Artist = Artist;