"use strict";

const fs = require('fs');
const handlebars = require('hbs');


/*const style = fs.readFileSync('./views/htmlComponents/style.hbs').toString();
const head = fs.readFileSync('./views/htmlComponents/headInfo.hbs').toString();
const navigationbar_unselected = fs.readFileSync('./views/htmlComponents/navigationbar_unselected.hbs').toString();
const navigationbar_selected = fs.readFileSync('./views/htmlComponents/navigationbar_selected.hbs').toString();
const loginForm = fs.readFileSync('./views/htmlComponents/loginForm.hbs').toString();
const playlistTable = fs.readFileSync('./views/htmlComponents/playlistTable.hbs').toString();
const inputGroup = fs.readFileSync('./views/htmlComponents/inputGroup.hbs').toString();


const sb_script = handlebars.compile(fs.readFileSync('./views/htmlComponents/searchbar_script.hbs').toString());
const tktb = handlebars.compile(fs.readFileSync('./views/htmlComponents/trackTable.hbs').toString());
const abpl = handlebars.compile(fs.readFileSync('./views/htmlComponents/albumsPanel.hbs').toString());
const sm = handlebars.compile(fs.readFileSync('./views/htmlComponents/searchMenu.hbs').toString());
const drp = handlebars.compile(fs.readFileSync('./views/htmlComponents/drop.hbs').toString());
const plst = handlebars.compile(fs.readFileSync('./views/htmlComponents/playlist.hbs').toString());
const shplst = handlebars.compile(fs.readFileSync('./views/htmlComponents/sharedPlaylist.hbs').toString());


const searchbar_script = function(parameter)	
{
	return sb_script(
	{
		component:parameter
	});
};

const searchMenu = function(parameter)
{
	return sm(
	{
		phrase:parameter
	});
}

const trackTable = function(parameter)
{
	return tktb(
	{
		playlistId:parameter.playlistId,
		album:parameter.album,
		user:parameter.user,
		tracks: parameter.tracks
	});
}

const albumsPanel = function(parameter)
{
	return abpl(parameter);
}

const drop = function(music,lists,track)
{
	return drp(
	{
		musicId:music,
		playlists:lists,
		track:track
	});
}

const playlist = function(parameter)
{
	
	return plst(
	{
		id:parameter.id,
		name:parameter.name,
	});
	
}

const sharedPlaylist = function(parameter)
{
	
	return shplst(
	{
		id:parameter.id,
		name:parameter.name,
		owner:parameter.owner,
		accepted:parameter.accepted
	});
	
}

module.exports.searchMenu = searchMenu;
module.exports.searchbar_script = searchbar_script;
module.exports.headinfo = head;
module.exports.navigationbar_unselected = navigationbar_unselected;
module.exports.navigationbar_selected = navigationbar_selected;
module.exports.style = style;
module.exports.trackTable = trackTable;
module.exports.albumsPanel = albumsPanel;
module.exports.drop = drop;
module.exports.loginForm = loginForm;
module.exports.playlistTable = playlistTable;
module.exports.inputGroup = inputGroup;
module.exports.playlist = playlist;
module.exports.sharedPlaylist = sharedPlaylist;
*/