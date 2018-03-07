function addTrack(owner, playlistId, trackId) {
        let ow = "owner="+ owner;
        let plId = "playlistId=" + playlistId;
        let tkId = "trackId=" + trackId;

        const param=ow + '&' + plId + '&' + tkId;
        const path="/addTrack";
        ajaxRequest('POST', path, param)
        .then(data =>{
            alert("Add Successful!");
        })
        .catch(err => {
            alert(err);
        })
}

function removeTrack(id, playlistId, owner) {

        var idStr="id="+ id;
        var playlistIdStr="playlistId=" + playlistId;
        var ownerStr="owner=" + owner;

        const param=idStr + "&" + playlistIdStr + "&" + ownerStr;
        const path="/removeTrackPlaylist";
        ajaxRequest('POST', path, param)
        .then(data => {
            document.getElementById("trackTable").innerHTML =data;
        })
        .catch(err => {
            alert(err)
        })
		
}

function acceptInvite(playlistId) {

        const playlistIdStr="playlistId=" + playlistId;

        const path="/acceptInvite";

        ajaxRequest('POST', path, playlistIdStr)
        .then(data => {
            var parser = new DOMParser(), doc = parser.parseFromString(data, "text/html");
            document.getElementById("trackTable").innerHTML = data;
        })
        .catch(err => {
            alert(err)
        })
		
}

function removeSharedPlaylist(playlistId,owner) {

        var playlistIdSTR="playlistId=" + playlistId;
        var ownerSTR="owner=" + owner;
        var param = playlistIdSTR + '&' + ownerSTR;

        const path="/removeSharedPlaylist";

        ajaxRequest('POST', path, param)
        .then(data => {
            document.getElementById("playlistTable").removeChild(document.getElementById(playlistId));
        })
        .catch(err => {
            alert(err)
        })
		
}

function addPlaylist() {

        const name = document.getElementById("inputForm").value

        var playlistNameStr="name=" + name;
        const path="/createPlaylist";
        ajaxRequest('POST', path, playlistNameStr)
        .then(data => {
            var parser = new DOMParser()
            , doc = parser.parseFromString(data, "text/xml");
            document.getElementById("playlistTable").appendChild(doc.firstChild);
        })
        .catch(err => {
            alert(err)
        })

		
}

function removePlaylist(playlistId) {

        var param="name=" + playlistId;

        const path="/removePlaylist";

        ajaxRequest('POST', path, param)
        .then(data => {
            document.getElementById("playlistTable").removeChild(document.getElementById(playlistId));
        })
        .catch(err => {
            alert(err)
        })
		
}

function editPlaylistName(playlistName, playlistId) {
        var newName = prompt("Please provide new Name", playlistName);
        if(newName != null){
            var playlistIdStr="playlistId=" + playlistId
            var newNameStr="newName=" + newName

            const path="/editPlaylistName";
            const param =playlistIdStr + '&' + newNameStr;
            ajaxRequest('POST', path, param)
            .then(data => {
                document.getElementById(playlistId).innerHTML =data;
            })
            .catch(err => {
                alert(err)
            });
        }
    
}

function ajaxRequest(meth, path, param) {
    const promise = new Promise((resolve, reject) => {
        const xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                if (xmlhttp.status == 200) {
                    resolve(xmlhttp.responseText)
                }
                else {
                    reject(new Error(xmlhttp.statusText))
                }
            }
        }    
        xmlhttp.open(meth, path, true)
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        xmlhttp.send(param)
    })
    return promise
}

function enterPressed(e)
{
    if(document.getElementById("btn").disabled != true)
        if (e.keyCode == 13) 
        {
            addPlaylist();
        }
}

function buttonActivate()
{    
    if (document.getElementById("inputForm").value.length < 3)
        document.getElementById("btn").disabled = true;
    else
        document.getElementById("btn").disabled = false;

}

function enterPressed(e,dest)
{
    if(document.getElementById("btn").disabled != true)
    if (e.keyCode == 13) 
    {
        const inputValue = dest + "/" + document.getElementById('inputForm').value.toString();
        window.location.replace(inputValue);
    }
}
		
function buttonActivate()
{
    if (document.getElementById("inputForm").value.length < 1)
        document.getElementById("btn").disabled = true;
    
    else
        document.getElementById("btn").disabled = false;
}


function redirect(dest)
{
    const inputValue = dest + "/" + document.getElementById('inputForm').value.toString();
    window.location.replace(inputValue);
}

function stopShare(username,playlistId){
        var user="username=" + username;
        var playlist = "playlistId=" + playlistId;

        const path="/stopShare";

        ajaxRequest('POST', path, user + "&" + playlist)
        .then(data => {
            document.getElementById("sharedTable").removeChild(document.getElementById(username));
        })
        .catch(err => {
            alert(err)
        });
}

function giveOrTakeWrite(username, playlistId){
        const user="username=" + username;
        const playlist = "playlistId=" + playlistId;
        var checkedValue = null; 
        const inputElements = document.getElementById('chk' + username);
            if(inputElements.checked)
                checkedValue = true;
            else 
                checkedValue = false
            

        const giveOrTake = "giveOrTake=" + checkedValue;
        const path="/giveOrTakeWrite";

        ajaxRequest('POST', path, user + "&" + playlist + "&" + giveOrTake);
}