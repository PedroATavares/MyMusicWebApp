"use strict";

var request = require('request');
var Album = require('./albumSearch.js');

function Albums(json)
{	
	this.albums = [];
	obtainAlbums(json.items , this.albums);
}

/*
* Recieves a array os Json Artists and an empty array
*/
function obtainAlbums(items,albums)
{
	items.forEach((item) =>
	{
		if(isValidAlbumTitle(item,albums))
		{	
			if(item.images[1])
				var tmp = item.images[1].url;
			
			albums.push(
				{
					name: item.name,
					id: item.id,
					img: tmp
				}
			);
		}
	}); 
}

function isValidAlbumTitle(album,albums)
{
	for (let i = 0; i <albums.length; i++)
	{			
		if(albums[i].name.localeCompare(album.name) == 0)
		{
			return false;
		}	
	}
	return true;
}

function getAlbums(cb,uri)
{	
	request(uri, (err,res,body) =>
	{
		if(!err)
		{
			cb(null,new Albums(JSON.parse(body)));
		}
		else
			cb(err,null);
	});
}

module.exports.getAlbums = getAlbums;