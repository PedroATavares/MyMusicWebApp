"use strict"

const port = (process.env.PORT) || 8080;
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path')
const passport = require('passport')
const passportStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const connectCtr = require('connect-controller')

const usersService = require('./model/usersService.js')

const server = express();
server.set('view engine', 'hbs');

/**
 * Passport setup
 */
passport.use(new passportStrategy((username, password, cb) => {
        usersService.authenticate(
            username, 
            password,
            cb
        )
}))
passport.deserializeUser((userId, cb) => {
    usersService.find(userId, cb)
})
passport.serializeUser((user, cb) => {
    cb(null, user.username)
});

//Middlewars
server.use(favicon(path.dirname(require.main.filename) +  '/res/icon.ico'));
server.get('/', (req, res) => res.redirect('/music/home'));
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser())
server.use(bodyParser())
server.use(expressSession({ secret: 'javascript is like texas' }));
server.use(passport.initialize());
server.use(passport.session());
server.use(connectCtr());

server.post('/login', passport.authenticate('local', 
{ 
    successRedirect: '/music/userMenu',
    failureRedirect: '/music/failedLogin' 
}));

server.post('/logout', function(req, res)
{
  req.logout();
  res.redirect('/music/home');
});

server.post('/signup', usersService.create)
server.post('/addTrack', usersService.addTrack)
server.post('/createPlaylist', usersService.addPlaylist)
server.post('/sharePlaylist', usersService.sharePlaylist)
server.post('/removePlaylist', usersService.removePlaylist)
server.post('/removeTrackPlaylist', usersService.removeTrackPlaylist)
server.post('/editPlaylistName', usersService.editPlaylistName)
server.post('/acceptInvite', usersService.acceptInvite)
server.post('/removeSharedPlaylist', usersService.removeSharedPlaylist)
server.post('/cancelInvite', usersService.cancelInvite)
server.post('/stopShare', usersService.stopShare)
server.post('/giveOrTakeWrite', usersService.giveOrTakeWrite)


server.use((req, res, next) => {
    const err = new Error('Resource not found')
    err.status = 404
    next(err)
});

server.use((err, req, res, next) => {
    if(!err.status) err.status = 500
    res.statusMessage = err.message 
    res.status(err.status)
    res.render('error', {
        title: 'Error',
        message: err.message,
        error: err,
        user:req.user
    });
});

server.listen(port, () => console.log('server listening on port ' + port));
server.on('error', err => 
{
    throw err
} );
