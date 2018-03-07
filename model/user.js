"use strict"

const Playlist = require('./playlist.js');

function User(json)
{
    this._id = json.username,
    this.username = json.username,
    this.password = json.password,
    this.fullname = json.fullname,
    this.playlists = [];
    getPlaylists(json.playlists, this.playlists);
    this.sharedPlaylists = json.sharedPlaylists;
}

function User(user, pw, name)
{
    this._id = user,
    this.username = user,
    this.password = pw,
    this.fullname = name,
    this.playlists = [];
    this.sharedPlaylists = [];
}

function getPlaylists(items,playlists)
{
	items.forEach((item) =>
	{
		playlists.push(new Playlist(item));
	});
}

module.exports.User = User;