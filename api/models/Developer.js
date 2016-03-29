/**
 * Person.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    username : {
        type: 'string',
        defaultsTo: ''
    },

    github_id : {
        type: 'integer',
        defaultsTo: 0
    },

    name : {
        type: 'string',
        defaultsTo: ''
    },

    company : {
        type: 'string',
        defaultsTo: ''
    },

    blog_url : {
        type: 'string',
        defaultsTo: ''
    },

    location: {
        type: 'string',
        defaultsTo: ''
    },

    email: {
        type: 'string',
        defaultsTo: ''
    },

    avatar_url : {
        type: 'string',
        defaultsTo: ''
    },

    url : {
        type: 'string',
        defaultsTo: ''
    },

    html_url : {
        type: 'string',
        defaultsTo: ''
    },

    public_repos: {
        type: 'integer',
        defaultsTo: 0
    },

    public_gists: {
        type: 'integer',
        defaultsTo: 0
    },

    followers: {
        type: 'integer',
        defaultsTo: 0
    },

    following: {
        type: 'integer',
        defaultsTo: 0
    },

    followers_url : {
        type: 'string',
        defaultsTo: ''
    },

    following_url : {
        type: 'string',
        defaultsTo: ''
    },

    gists_url : {
        type: 'string',
        defaultsTo: ''
    },

    subscriptions_url : {
        type: 'string',
        defaultsTo: ''
    },

    organisations_url : {
        type: 'string',
        defaultsTo: ''
    },

    repos_url : {
        type: 'string',
        defaultsTo: ''
    },

    activity: {
        type: 'integer',
        defaultsTo: 0
    },
  }
};
