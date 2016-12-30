/**
 * Students.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: { 'type': 'string' },
    major: { 'model': 'Majors' },
    enrollments: { 'collection': 'Enrollments', 'via': 'student' }
  }
};
