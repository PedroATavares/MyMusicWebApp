"use strict"

var Track = require('./trackSearch.js');

function SharedPlaylist(json)
{
    this.owner = json.owner;
    this.id = json.name;
    
    //unique habilities
    this.accepted = json.accepted;
    this.editable = json.editable;
}

module.exports = SharedPlaylist;