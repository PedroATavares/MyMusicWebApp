"use strict";
const CommandsService = require('./../model/commandsService.js');
const userService = require('./../model/usersService.js');
const cache = require('./cache.js');
const fs = require('fs');
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/../views/partials');
const lodash = require('lodash');
const viewSearch = hbs.compile(fs.readFileSync('./views/music/searchView.hbs').toString());
const viewArtist = hbs.compile(fs.readFileSync('./views/music/artists.hbs').toString());

module.exports = {
    /**
     * Route to /leagues
     */
    'searchMenu':function(req){
        return {
			name:'Search',
			phrase:'Write an artist name...',
			user:req.user,
			dest:'search'
		}
    },    
    
    'home':function (req) { // IF we return a Promise we cannot receive res
        return {
            user:req.user
        }
    },
    
    'artistsMenu':function(req)
    {
        return {
			name:'Artists',
			phrase:'Write an artist id...',
			user:req.user,
			dest:'artists'
		}
    },

    'sharePlaylistMenu_id':function(id,req)
    {
        if(req.user==undefined){
            const err = new Error("User not logged in");
            err.status = 400;
            throw err;
        }
        return {
            playlistName:req.url.split("?playlistName=")[1],
            id:id,
            user:req.user
        }
    },

    'register':function(req)
    {
        return
    },
    
    'loginMenu':function(req){
        return {
		name:'Log in',
		user:req.user,
	    }
    },
    
    'userMenu':function(req){
        if(req.user == undefined){
		    const err = new Error('No user logged in');
            err.status = 400;
            throw err;
	    }
	
        else{  
            return{
                user:req.user
		    }
        }
    },

    'playlists_playlistId':function(playlistId,req,res)
    {
        const user = req.user;

        if(user == undefined)
        {
		    const err = new Error('No user logged in');
            err.status = 400;
            throw err;
	    }
	
        else
        {
             const sharedPlaylistIdx = lodash.findIndex(user.sharedPlaylists, x => x.id === playlistId);
             let playlist;

             if(sharedPlaylistIdx != -1)
             {
                const owner = userService.getUser(user.sharedPlaylists[sharedPlaylistIdx].owner, 
                    (err,owner) => 
                    {
                        if(err){
                            const err = new Error('Destinatary not found');
                            err.status = 404;
                            throw err;
                        }
                        else
                        {
                            const receivedPlaylistIdx = lodash.findIndex(owner.playlists, x => x.id === playlistId);
                            playlist = owner.playlists[receivedPlaylistIdx];
                            CommandsService['tracks']((err,data) =>
                            {
                                if(err)
                                    throw new Error('Error parsing tracks');
                                    const allTracks=
                                    {
                                        tracks:data,
                                        user:req.user,
                                        playlistId:playlistId,
                                        Permission:user.sharedPlaylists[sharedPlaylistIdx].editable,
                                        owner:owner.username
                                    }

                                    res.render('music/playlists', allTracks);
                                    return;

                            },playlist.tracks);
                        }
                    });
             }
             else
             {
                const PlaylistIdx = lodash.findIndex(user.playlists, x => x.id === playlistId);
                if(PlaylistIdx == -1) {
                    const err = new Error("Playlist Not found");
                    err.status = 404;
                    throw err;
                }
                playlist = user.playlists[PlaylistIdx];

                CommandsService['tracks']((err,data) =>
                {
                    if(err)
                        throw new Error('Error parsing tracks');
                 
                        const allTracks=
                        {
                            tracks:data,
                            user:req.user,
                            playlistId:playlistId,
                            Permission:true,
                            owner:user.username
                        }

                        res.render('music/playlists', allTracks);
                        return;

                },playlist.tracks)

             }
        }
    },

    'search_name':function(name,req,res)
    {   
        let result = cache.get("search_" + name);

        if(result != undefined)
        { 
            res.writeHead(200);
            res.write(result);
            res.end()
        }
        else
        {
            CommandsService['search']((err,data) => 
            {
                if(err)
                    throw err;
                else
                {
                    var separated = name.split("&");
                    data.base="./" + separated[0];
                    data.name ='Search results';
                    data.user = req.user;

                    result = viewSearch(data);
                    
                    //cache saving
                    cache.set("search_" + name,result.toString());
                    res.render('./music/searchView',data)
                }
            },name);
        }
    },
    
    'artists_id':function(id,req,res)
    {
        let result = cache.get("artists_" + id);

        if(result != undefined)
        { 
            res.writeHead(200);
            res.write(result);
            res.end()
        }

        else
        CommandsService['artist']((err,data) => 
        {
            if(err)
                throw err

            else
            {				
                CommandsService['albums']((err,albums) => 
                {
                    if(err) 
                        throw err;
                    else
                    {
                        data.user = req.user;
                        data.albums=albums.albums;
                        result =viewArtist(data);

                        //cache saving
                        cache.set("artists_" + id,result.toString());
                        res.render("./music/artists.hbs",data);
                    }
                },data.id);
            }
        },id);
    },
    
    'albums_id':function(id, req,res){
        CommandsService['album']((err,data) => 
        {
            if(err)
                throw err;
            else
            {	
                data.user=req.user;
                data.album=true;
                if(req.user!=undefined)
                {
                    data.playlists=req.user.playlists;
                    data.sharedPlaylists=req.user.sharedPlaylists;
                    data.owner = req.user.username;
                }

                res.render('./music/albums.hbs',data)
                
            }
        },id,req);
    },

    'permissions_id':function(id, req){
        if(req.user== undefined){
            const err = new Error("User not logged in");
            err.status = 400;
            throw err;
        }
        const user = req.user;
        
        const PlaylistIdx = lodash.findIndex(user.playlists, x => x.id === id);
        
        if(PlaylistIdx == -1) {
            const err = new Error("Playlist Not found");
            err.status = 404;
            throw err;
        }
        
        const playlist = user.playlists[PlaylistIdx];

        return {
            playlistName:playlist.name,
            sharedUsers:playlist.sharedUsers,
            user:{fullname:user.fullname},
            playlistId:playlist.id
        }
    }
    
}