"use strict";

/**
 * Array of User objects
 */
var request = require('request');
const lodash = require('lodash');
const User = require('./user.js').User;
const ComponentSupplier = require('./../views/htmlComponents/componentSupplier.js');
const CommandsService = require('./../model/commandsService.js');
const base = 'https://pedroatavares:aWlvamV3b2lqZXcrb3h4bW5jYnVndmgnccKrLA==@pedroatavares.cloudant.com/pi/';

module.exports = 
{
    'find': find,
    'authenticate': authenticate,
    'create': create,
    'addPlaylist':addPlaylist,
    'addTrack':addTrack,
    'removePlaylist':removePlaylist,
    'removeTrackPlaylist':removeTrackPlaylist,
    'editPlaylistName':editPlaylistName,
    'sharePlaylist':sharePlaylist,
    'acceptInvite': acceptInvite,
    'removeSharedPlaylist': removeSharedPlaylist,
    'cancelInvite':cancelInvite,
    'getUser': getUser,
    'stopShare':stopShare,
    'giveOrTakeWrite':giveOrTakeWrite
}

function find(username, cb) 
{
    getUser(username, (err,user) =>
	{
        if(err == null)
            cb(null, user);
        else
			cb(err,null);
    });
}

function authenticate(username, passwd, cb) 
{
    getUser(username, (err,user) =>
    {
            if(err == null)
            {
                if(passwd != user.password)
                     return cb(new Error('Invalid password'))
                else 
                    return cb(null, user)
            }
            else
                return cb(new Error('User does not exist'))
    });
}

function acceptInvite(req,res) 
{
    const playlistId = req.body.playlistId;
    let user = req.user;

    const idx = lodash.findIndex(user.sharedPlaylists,x=>x.id === playlistId);
    user.sharedPlaylists[idx].accepted = true;
    
    insert(user);

    res.redirect('/music/userMenu');
}

function removeSharedPlaylist(req,res) 
{
    const user = req.user;
    const playlistId = req.body.playlistId;
    const owner = req.body.owner;

    getUser(owner, (err,ownerJson) =>
    {
            if(err)
                throw new Error("No user found");

            else
            {
                const playlistIdx = lodash.findIndex(ownerJson.playlists,x=>x.id === playlistId);
                const sharedUsersIdx = lodash.findIndex(ownerJson.playlists[playlistIdx].sharedUsers,x=>x.username === user.username);
                ownerJson.playlists[playlistIdx].sharedUsers.splice(sharedUsersIdx,1);
                insert(ownerJson);
            }
    });

    const idx = lodash.findIndex(user.sharedPlaylists,x=>x.id === playlistId);
    user.sharedPlaylists.splice(idx,1);
    insert(user);

    res.redirect('/music/userMenu');
}

function create(req,res)
{
    const user = new User(req.body.user, req.body.pw, req.body.name);
    
    getUser(req.body.user, (err,data) => 
    {
        if(err != null)
        {
                insert(user);   
        }

        else
            {
                const error = new Error("username already taken");
                error.status=400;
                throw error;
            }
    });

    res.redirect('/music/loginMenu');
}

function insert(user)
{
    request
    (
        {
            url: base, //URL to hit
            method: 'POST',
            json: user
        },
        (err,res,body) => 
        {
            if(err)
               throw err;
        }
    );
}

function addTrack(req,res)
{
    const playlistId = req.body.playlistId;
    const ownerName = req.body.owner;
    const trackId = req.body.trackId;
    const user =req.user;

    if(ownerName == undefined) 
        ownerName = user.username;

    if(ownerName != user.username)
    {
        getUser(ownerName, (err, owner) =>
        {
            if(err)
                throw err;
            else
            {
                const playlistIdx = lodash.findIndex(owner.playlists, x => x.id === playlistId);
                owner.playlists[playlistIdx].tracks.push({id:trackId});
                insert(owner);
                res.end();
                return;
            }
        });
    }
    else
    {
        const idx = lodash.findIndex(user.playlists,x=>x.id === playlistId);
        const playlist = user.playlists[idx];
        playlist.tracks.push({id:trackId});
        insert(user);
        res.end();
    }
}

function addPlaylist (req, res) 
{
    var name = req.body.name;

    const user=req.user;
    
    user.playlists.push(
        {
            name:name,
            tracks:[],
            id:user.username + "" +(user.index++),
            sharedUsers:[]
        }
    );

    insert(user);
    
    const idx=user.playlists.length-1;
    res.render('partials/playlist',user.playlists[idx]);
}

function removePlaylist (req, res) 
{
    var name = req.body.name;
    const user=req.user;

    const idx = lodash.findIndex(user.playlists,x=>x.id === name);
    user.playlists[idx].sharedUsers.forEach(x => removeRemotePlaylist(x.username,name));
    user.playlists.splice(idx,1);

    insert(user);

    res.writeHead(200);
    res.end();
}

function removeRemotePlaylist(username,playlistId)
{
    getUser(username, (err,user) =>
    {
            if(err == null)
            {
                const idx = lodash.findIndex(user.sharedPlaylists,x=>x.id === playlistId);
                user.sharedPlaylists.splice(idx,1);
                insert(user);
            }
    });
}

function cancelInvite(req,res)
{
    const playlistId = req.body.playlistId;
    const user=req.user;
    const owner= req.body.playlistOwner
    request( base + user.username, (err,res,body) =>
    {
            if(!err && res.statusCode == 200)
            {
                const user = JSON.parse(body);
                if(user)
                {
                    const idx = lodash.findIndex(user.sharedPlaylists,x=>x.id === playlistId);
                    user.sharedPlaylists.splice(idx,1);
                    insert(user);
                }
            }
    });
    res.redirect('/music/userMenu')
}

function getUser(username, cb)
{
    request(base + username, (err,res,body) =>
    {
            let parsed = JSON.parse(body);
            if(parsed.error == null)
                cb(null, parsed)
            else
                cb(parsed,null);
    });
}

function editPlaylistName (req, res) 
{
    var playlistId = req.body.playlistId;
    const user=req.user;
    const newName=req.body.newName;
    const idx = lodash.findIndex(user.playlists,x=>x.id === playlistId);
    user.playlists[idx].name=newName;

   insert(user);
}

function sharePlaylist (req, resp) 
{
    let owner=req.user;

    const playlistId = req.body.playlistId;
    const receiverId = req.body.receiverId;
    const playlistName = req.body.playlistName;

    if(owner.username == receiverId)
    {
        resp.redirect('/music/userMenu');
        return;
    }

    let editable = req.body.editable;

    if(editable == undefined)
        editable = false;
    else
    editable = true;

    getUser(receiverId, (err, receiver) => 
    {
        if(err)
        {   
            err.status=404;
            resp.render('error',{
                                    title: 'Error',
                                    message: "The user who you were trying to share the playlist isn't valid!",
                                    error: err,
                                    user:req.user
                                 })
            return;
        }
        else
        {
            if(lodash.findIndex(receiver.sharedPlaylists,x=> x.id === playlistId) == -1)
            {    
                receiver.sharedPlaylists.push(
                {
                    owner:owner.username,
                    id:playlistId,
                    name:playlistName,
                    accepted:false,
                    editable:editable,
                });
        
        
                insert(receiver);
            

                //UPDATE owner
                let idx = lodash.findIndex(owner.playlists,x=>x.id === playlistId);
                owner.playlists[idx].sharedUsers.push(
                {
                    username:receiverId,
                    editable:editable
                });

                insert(owner);

                resp.redirect('/music/userMenu');
                return;
            }
        }
    });
}

function removeTrackPlaylist (req, res) 
{
    var id = req.body.id;
    const playlistId=req.body.playlistId;
    const ownerId = req.body.owner;
    const user=req.user;

    if(ownerId != user.username)
    {
        getUser(ownerId, (err,owner) =>
        {
            if(err)
                throw new Error("Playlist owner not found");
            else
                removeTrackPlaylist_2(req,res,owner,playlistId, id);
                return;
        });
    }
    else
    {
        removeTrackPlaylist_2(req,res,user,playlistId, id);
    }
}

function removeTrackPlaylist_2 (req, res, user, playlistId, id)
{
    const idxPlaylist = lodash.findIndex(user.playlists,x=>x.id === playlistId);
    const idxTrack = lodash.findIndex(user.playlists[idxPlaylist].tracks,x=>x.id === id);
    user.playlists[idxPlaylist].tracks.splice(idxTrack,1);

    insert(user);

    CommandsService['tracks']((err,data) =>
    {
        const allTracks=
        {
            tracks:data,
            user:user,
            playlistId:playlistId
        }
        
        res.render("partials/trackTable", allTracks);

    },user.playlists[idxPlaylist].tracks)
}

function stopShare(req, res){
    const user = req.user;
    const username= req.body.username
    const playlistId = req.body.playlistId

    getUser(username,(err,sharedUser)=>{
        const sharedIdx = lodash.findIndex(sharedUser.sharedPlaylists,x=>x.id === playlistId);
        const playlistIdx = lodash.findIndex(user.playlists,x=>x.id === playlistId);
        const userSharedIdx = lodash.findIndex(user.playlists[playlistIdx].sharedUsers,x=>x.username === username);
        
        sharedUser.sharedPlaylists.splice(sharedIdx,1);
        user.playlists[playlistIdx].sharedUsers.splice(userSharedIdx,1);

        insert(user);
        insert(sharedUser);
        res.end();
    })
}

function giveOrTakeWrite(req, res){
    const user = req.user;
    const username= req.body.username
    const playlistId = req.body.playlistId
    const giveOrTake = req.body.giveOrTake === "true"

    getUser(username,(err,sharedUser)=>{
        const sharedIdx = lodash.findIndex(sharedUser.sharedPlaylists,x=>x.id === playlistId);
        const playlistIdx = lodash.findIndex(user.playlists,x=>x.id === playlistId);
        const userSharedIdx = lodash.findIndex(user.playlists[playlistIdx].sharedUsers,x=>x.username === username);
        
        sharedUser.sharedPlaylists[sharedIdx].editable=giveOrTake;
        user.playlists[playlistIdx].sharedUsers[userSharedIdx].editable=giveOrTake;

        insert(user);
        insert(sharedUser);
        res.end();
    })
}