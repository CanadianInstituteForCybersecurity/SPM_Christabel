// userModel.js
const bcrypt = require('bcrypt');
// const connection = require('../app.js');
const CryptoJS = require("crypto-js");
//const mysql = require('mysql');
const jwtUtils = require("./jwtUtils");
const connection = require('./dbConnection');

// MySQL database connection

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: null,
//   database: 'ecommerce_db'
// });


// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});

// Function to find user by username
async function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
   
    connection.query('SELECT * FROM User WHERE username = ?', [username], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    }
    )
    // connection.query('SELECT * FROM user')
  });
};

function encrypt(src) {
  const passphrase = 'your-secret-key';
  return CryptoJS.AES.encrypt(src, passphrase).toString();
}

function decrypt(src) {
  const passphrase = 'your-secret-key';
  const bytes = CryptoJS.AES.decrypt(src, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

async function hashPassword_bcrypt(plaintextPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);
    //console.log('Hashed password:', hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

// Function to authenticate user
async function authenticateUser(username, password) {
  try {
    const user = await findUserByUsername(username)
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    // const hashedpw = await bcrypt.hash(password,10);- use this for hashing the password of the user from the frontend
    // console.log("hashed password:",{hashedpw})
    const passwordMatch = await bcrypt.compare(password, user.password);
    // console.log("bcrypt result :",{passwordMatch})
    if (passwordMatch) {
      const token = jwtUtils.generateToken(user.id);      
      return { success: true, message: 'Login successful',token, type: user.type,user };
    } else {   
      return { success: false, message: 'Invalid password' };
    }
  } catch (error) {
    console.error('Error finding user:', error);
    return { success: false, message: 'Error finding user' };
  }
}

// Function to create a new user
async function createUser(firstname,lastname,username,type,password) {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password with bcrypt
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO user (firstname,lastname,username,type,password) VALUES (?, ?, ?, ?, ?)', [firstname,lastname,username,type, hashedPassword], (error, results) => {
      if (error) {
        console.error('Error creating user:', error);
        reject( { success: false, message: 'Error creating user' });
      } else {
        resolve({ success: true, message: 'User created successfully' });
      }
    });
  });
}

// async function changePassword(userId, newPassword) {
//   try {
//     const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash new password with bcrypt
//     await new Promise((resolve, reject) => {
//       connection.query('UPDATE user SET password = ? WHERE id = ?', [hashedPassword, userId], (error, results) => {
//         if (error) {
//           console.error('Error changing password:', error);
//           reject({ success: false, message: 'Error changing password',result: results[0] });
//         } else {
//           resolve({ success: true, message: 'Password changed successfully', result: results[0] });
//         }
//       });
//     });
//   } catch (error) {
//     console.error('Error changing password:', error);
//     return { success: false, message: 'Error changing password' };
//   }
// }

async function changePassword(userId,password) {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password with bcrypt
  return new Promise((resolve, reject) => {
    connection.query('UPDATE user SET password = ? WHERE id = ?', [hashedPassword, userId], (error, results)=> {
      if (error) {
        console.error('Error creating user:', error);
        reject( { success: false, message: 'Error changing password' });
      } else {
        resolve({ success: true, message: 'Password changed successfully' });
      }
    });
  });
}

// Function to edit a user
async function editUser(userId, firstname, lastname, username, type, password) {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password with bcrypt
  return new Promise((resolve, reject) => {
    connection.query('UPDATE user SET firstname = ?, lastname = ?, username = ?, type = ?, password = ? WHERE id = ?', [firstname, lastname, username, type, hashedPassword, userId], (error, results) => {
      if (error) {
        console.error('Error editing user:', error);
        reject({ success: false, message: 'Error editing user' });
      } else {
        resolve({ success: true, message: 'User edited successfully' });
      }
    });
  });
}

// Function to view a user
async function viewUser(userId) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM user WHERE id = ?', [userId], (error, results) => {
      if (error) {
        console.error('Error viewing user:', error);
        reject({ success: false, message: 'Error viewing user' });
      } else {
        resolve({ success: true, user: results[0] });
      }
    });
  });
}
// Function to view all users
async function viewUsers(type) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM user WHERE type = ?', [type],(error, results) => {
      if (error) {
        console.error('Error viewing users:', error);
        reject({ success: false, message: 'Error viewing users' });
      } else {
        resolve({ success: true, message: results });
      }
    });
  });
}

// Function to delete a user
async function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM user WHERE id = ?', [userId], (error, results) => {
      if (error) {
        console.error('Error deleting user:', error);
        reject({ success: false, message: 'Error deleting user' });
      } else {
        resolve({ success: true, message: 'User deleted successfully' });
      }
    });
  });
}

// connection.end()
module.exports = {
  findUserByUsername,
  encrypt,
  decrypt,
  hashPassword_bcrypt,
  authenticateUser,
  createUser,
  editUser,
  viewUser,
  viewUsers,
  deleteUser,
  changePassword

}
