const CryptoJS = require("crypto-js");
//const mysql = require('mysql');
const jwtUtils = require("./jwtUtils");
const connection = require('./dbConnection');


// Function to add feedback
async function addFeedback(name,email,type,message) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO feedback (name,email,type,message) VALUES (?, ?,?,?)', [name,email,type,message], (error, results) => {
        if (error) {
          console.error('Error adding feedback:', error);
          reject({ success: false, message: 'Error adding feedback' });
        } else {
          resolve({ success: true, message: 'Feedback added successfully' });
        }
      });
    });
  }
  
  // Function to delete feedback
  async function deleteFeedback(feedbackId) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM feedback WHERE id = ?', [feedbackId], (error, results) => {
        if (error) {
          console.error('Error deleting feedback:', error);
          reject({ success: false, message: 'Error deleting feedback' });
        } else {
          resolve({ success: true, message: 'Feedback deleted successfully' });
        }
      });
    });
  }
  
  // Function to view feedback
  async function viewFeedback(userId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM feedback WHERE user_id = ?', [userId], (error, results) => {
        if (error) {
          console.error('Error viewing feedback:', error);
          reject({ success: false, message: 'Error viewing feedback' });
        } else {
          resolve({ success: true, feedback: results });
        }
      });
    });
  }


  module.exports={
    addFeedback,
    deleteFeedback,
    viewFeedback
  }