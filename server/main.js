import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

AccountsGuest.anonymous = true;

Meteor.startup(() => {
});

Meteor.publish('presences', function() {
    return Presences.find({}, { userId: true });
  });
  Meteor.publish("users", function () {
    return Meteor.users.find({}, {fields: {"profile.peerId": true} });
  });
const Peers = new Meteor.Collection('peers');

Meteor.publish('userPresence', function() {
  // Setup some filter to find the users your user
  // cares about. It's unlikely that you want to publish the 
  // presences of _all_ the users in the system.
  
  // If for example we wanted to publish only logged in users we could apply:
  // filter = { userId: { $exists: true }};
  var filter = {}; 
  
  return Presences.find(filter, { fields: { state: true, userId: true }});
});


const Users = new Meteor.Collection('usersLive');
const Rooms = new Meteor.Collection("rooms");
const Bubbles = new Meteor.Collection("bubbles");
Meteor.bubbles = Bubbles;

Meteor.users.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return userId;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  fetch: ['_id']
});



Meteor.publish('userSubscription', function () {
  var self = this;
  var handle = Meteor.users.find({}).observeChanges({
    added: function (id, fields) {
      self.added('users', id, fields);
    },
    changed: function (id, fields) {
      self.changed('users', id, fields);
    },
    removed: function (id) {
      self.removed('users', id);
    }
  });

  self.ready();

  self.onStop(function () {
    handle.stop();
  });
});

Meteor.publish('bubbleSubscription', function () {
  var self = this;
  var handle = Meteor.bubbles.find({}).observeChanges({
    added: function (id, fields) {
      self.added('bubbles', id, fields);
    },
    changed: function (id, fields) {
      self.changed('bubbles', id, fields);
    },
    removed: function (id) {
      self.removed('bubbles', id);
    }
  });

  self.ready();

  self.onStop(function () {
    handle.stop();
  });
});

