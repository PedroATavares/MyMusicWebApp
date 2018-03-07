"use strict"

var Track = require('./trackSearch.js');

function Playlist(json)
{
    this.name = json.name;
    this.tracks = [];
    getTracks(json.tracks,this.tracks);
	this.size = tracks.length;
}

function getTracks(items,tracks)
{
	items.forEach((item) =>
	{
		tracks.push(new Track.Track(item));
	})
}

module.exports = Playlist;