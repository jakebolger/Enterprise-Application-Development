//Author: Jake Bolger, C18395341
//TUD


const bcrypt = require("bcrypt");
const { mongoConnection } = require("./connection");
/**
 * @registerUser
 */

function registerUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      
      let checkUserData = await checkIfUserExists({ email: userData.email });
      if (checkUserData.data && checkUserData.data.length > 0) {
        
        return resolve({
          error: true,
          message: "User already exists with this credentials. Please login",
          data: [],
        });
      }
      
      let passwordHash = await bcrypt.hash(userData.password, 15);
      userData.password = passwordHash;

      
      mongoConnection
        .collection("users")
        .insertOne(userData, async (err, results) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          
          resolve({
            error: false,
            data: results.ops,
          });
        });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * @verifyUser
 * @param {*} userData
 */

function verifyUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      let userDatafromDb = await checkIfUserExists({ email: userData.email });
      if (userDatafromDb.data && userDatafromDb.data.length > 0) {
        
        let passwordVerification = await bcrypt.compare(
          userData.password,
          userDatafromDb.data[0].password
        );
        if (!passwordVerification) {
          
          return resolve({
            error: true,
            message: "Invalid email or password",
            data: [],
          });
        }
        
        return resolve({ error: false, data: userDatafromDb.data[0] });
      } else {
        return resolve({
          error: true,
          message:
            "There is no user exists with this credentials. Please create a new account.",
          data: [],
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

/**
 * @checkIfUserExists
 */

function checkIfUserExists(userData) {
  return new Promise((resolve, reject) => {
    try {
      // check if user exists
      mongoConnection
        .collection("users")
        .find({ email: userData.email })
        .toArray((err, results) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          resolve({ error: false, data: results });
        });
    } catch (e) {
      reject(e);
    }
  });
}
/**
 * @updateUser
 */
function updateUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      // check if user exists
      let checkUserData = await checkIfUserExists({ email: userData.email });
      if (checkUserData.data && checkUserData.data.length > 0) {
        // user already exists, update the data
        let updateUserData = await mongoConnection
          .collection("users")
          .updateOne(
            { email: userData.email },
            {
              $set: {
                name: userData.name,
                email: userData.email,
                dob: userData.dob,
                city: userData.city,
                address: userData.address,
                gender: userData.gender,
                hobbies: userData.hobbies,
                civilS: userData.civilS,
                salary: userData.salary,
                picture: userData.picture,
                sport: userData.sport,
              }
            },
            (err, results) => {
              if (err) {
                console.log(err);
                throw new Error(err);
              }
              resolve({
                error: false,
                data: results,
              });
            }
          );
      } else {
        return resolve({
          error: true,
          message:
            "There is no user exists with this credentials. Please create a new account.",
          data: [],
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

module.exports = {
  registerUser: registerUser,
  verifyUser: verifyUser,
  updateUser : updateUser,
};
