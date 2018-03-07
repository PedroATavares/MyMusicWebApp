"use strict"

function SharedUser(json)
{
    this.username = json.username;
    this.editable = json.editable;
}

module.exports = SharedUser;