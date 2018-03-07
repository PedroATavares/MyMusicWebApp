"use strict";

const Artist = require('./artistSearch.js');
const Search = require('./searchSearch.js');
const Album = require('./albumSearch.js');
const Albums = require('./albumsSearch.js');
const Track = require('./trackSearch.js');
const request = require('request')

const spotifyAPI = 'https://api.spotify.com/v1/';


const services = {};

var bearer = null //'Bearer BQBqvVovNrOKC1JGTUXeTw6qKKhojS-ORn2e-TYz2q2XcK3Q4Y6uK07sW1KI2bYp8B2osmWP1SRG2dAHanE';
var timestamp = null;
services.artist = function(cb,parameter)
{
	checkBearer(()=>{
	const composedStr = spotifyAPI + 'artists/' + parameter;
	var options = {
		url: composedStr,
		headers: {
		  'Authorization': bearer
		}
	  };

	Artist.getArtist((err,data) =>
	{
		if(err)
			cb(err,null);
		else
			cb(null,data);
	},options);
});
}

services.search = function(cb,parameter)
{
	checkBearer(()=>{
	const composedStr = spotifyAPI + 'search?q=' + parameter + '&type=artist';
	var options = {
		url: composedStr,
		headers: {
		  'Authorization': bearer
		}
	  };
	Search((err,data) =>
	{
		if(err)
			cb(err,null);
		else
			cb(null,data);
	},options);
});
}

services.album = function(cb,parameter,req)
{
	checkBearer(()=>{
	const composedStr = spotifyAPI + 'albums/' + parameter;
	var options = {
		url: composedStr,
		headers: {
		  'Authorization': bearer
		}
	  };
	Album.getAlbum((err,data) =>
	{
		if(err)
			cb(err,null);
		else
			cb(null,data);
	},options,req.user);
});
}

services.albums = function(cb,parameter)
{
	checkBearer(()=>{
	const composedStr = spotifyAPI + 'artists/' + parameter + '/albums';
	var options = {
		url: composedStr,
		headers: {
		  'Authorization': bearer
		}
	  };
	Albums.getAlbums((err,data) =>
	{
		if(err)
			cb(err,null);
		else
			cb(null,data);
	},options);
	});
}

services.tracks= function(cb,parameter){
	
	checkBearer(()=>{
	const allTracks=[];
	if(parameter.length==0){
		cb(null,allTracks)
	}
	parameter.forEach((item) =>{
		const composedStr = spotifyAPI + 'tracks/' + item.id;
		var options = {
			url: composedStr,
			headers: {
				'Authorization': bearer
			}
			};
		Track.getTrack((err,data) =>
		{
			if(err)
				cb(err,null);
			else
				{
					allTracks.push(data)
					//console.log(parameter.length)
					if(allTracks.length==parameter.length){						
						cb(null,allTracks)
					}
			}
		
		},options)
	
})
});
}

function checkBearer(cb){
	if(!timestamp || 3500 < (new Date().getTime()/1000) - timestamp)
		{
			var options = {
				url: 'https://accounts.spotify.com/api/token',
				headers: {
				  'Authorization': 'Basic ZmY4NDM3MDBiMDY4NGRiYThkZTM5MDNmZmI2M2FlZjU6NGUzZjAwZDU3NjM3NDQ2Mjk4ZDM2YjA0NjFkMTA4MDE='
				},
				method: 'POST',
				form: {grant_type:'client_credentials'}
			  };
			request(options,(err, res, body) =>{
				bearer = 'Bearer ' + JSON.parse(body).access_token;
				timestamp = new Date().getTime()/1000;
				cb();
			})

		}
		else{
			cb();
		}
}


module.exports = services