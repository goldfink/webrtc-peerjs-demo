import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';
import './main.css';
import './jquery-ui.css';
import './peer.js';

Meteor.startup( function() {

import './three.js';
import './particles.js';
import './jquery.js';
import './jquery-ui.js';
const Peers = new Meteor.Collection('peers')

});
const peer = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/'
    });

Template.binary_streams.onCreated(function () {  
    Meteor.subscribe("users");
    Meteor.subscribe("presences");
        navigator.getUserMedia = ( navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia );

    // get audio/video
    navigator.getUserMedia({audio:true, video: true}, function (stream) {
        //display video
        var video = document.getElementById("myVideo");
      video.srcObject = stream;
        window.localStream = stream;
      },
      function (error) { console.log(error); }
    );

});

Template.binary_streams.events({
    "click #makeCall": function () {
      var user = this;
      console.log("user:", user);
      var outgoingCall = peer.call(user.profile.peer, window.localStream);
      window.currentCall = outgoingCall;
      outgoingCall.on('stream', function (remoteStream) {
        window.remoteStream = remoteStream;
        var video = document.getElementById("video-" + user.profile.peerId)
        video.src = URL.createObjectURL(remoteStream);
      });
    },
});

peer.on('open', function(id) {
Meteor.users.update({_id: Meteor.userId()}, {$set:{"profile":{"peer": id}}});
});


  if (!Session.get("current_bubble")) {
    Session.set("current_bubble", "null");
  }
  Session.set("current_room", new URL(document.location.href).searchParams.get("r") || "default");



let users = {}
let bubbles = {}

let user_name = "me";

Meteor.subscribe('userPresence');


Tracker.autorun(function () {
  Meteor.subscribe('userSubscription');
  //users = new Meteor.Collection('users');
});

Template.user_details.events({
  'submit form': function(event) {
    event.preventDefault();
    var user_name = event.target[0].value;
    Meteor.users.update({_id: Meteor.userId()}, {$set:{"profile":{"name": user_name}}});
  },
});



Template.bubbles.events({
  'submit form': function(event) {
    event.preventDefault();
    var bubble_name = event.target[0].value;
    var current_bubble = event.target[1].value;
    console.log("bubble_name", bubble_name);
    console.log("current_bubble", current_bubble);
    Session.set("current_bubble", current_bubble);
    Meteor.users.update({_id: Meteor.userId()}, {$set:{"profile":{"bubble": bubble_name}}});
  },
});


Template.avatars.helpers({
        users: function () {
      var userIds = Presences.find().map(function(presence) {return presence.userId;});
      // exclude the currentUser
      return Meteor.users.find({_id: {$in: userIds}});
    }

});

Template.room_info.helpers({
  current_room: function() { return Session.get("current_room") }
});

  Template.binary_streams.helpers({
    users: function () {
      var userIds = Presences.find().map(function(presence) {return presence.userId;});
      // exclude the currentUser
      return Meteor.users.find({_id: {$in: userIds, $ne: Meteor.userId()}});
    }
  });


Tracker.autorun(function () {

Template.bubbles.helpers({
  current_bubble: function(){
    return Session.get("current_bubble")
  }
});
});

Template.user_details.helpers({
  user: function(){
    return Meteor.users.find();
  },
  name: function(){
    return this.profile.name;
  }
});

Template.user_details.helpers({
  user_count: function(){
    return Presences.find().count()
  },
});

$(document.getElementsByClassName("draggable")).draggable()

