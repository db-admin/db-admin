/**
 * Sessions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'startDateTime': { 'type': 'datetime' },
    'endDateTime': { 'type': 'datetime' },
    'name': { 'type': 'string' },
    'classes':{
      'collection': 'classes',
      'via': 'sessions',
      'through': 'classsession'
    }
  }
};
