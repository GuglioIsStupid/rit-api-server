// User Modal, firestore

/**
    * * This function sets up the firebase app and firestore database.
    * * The app is used to connect to the firestore database.
    * * The database is used to store user data.
    * @param {Object} firebaseApp - The firebase app.
    * @returns {boolean} - If the app was set up.
*/

import mysql from 'mysql2';
var con = null;

function setupApp(db) {
    con = db;
    // go intop the users database
    con.query(
        "USE users",
        function(err, result) {
            if (err) throw err;

            // create the users table if it doesn't exist
            /* con.query(
                "CREATE TABLE IF NOT EXISTS users (steamId VARCHAR(255), userName VARCHAR(255), scores TEXT, uploadedBeatmaps TEXT, profilePicUrl VARCHAR(255), bannerPicUrl VARCHAR(255), bio TEXT, country VARCHAR(255), uniqueId VARCHAR(255), lastLogin VARCHAR(255), supporter BOOLEAN)",
                function(err, result) {
                    if (err) throw err;
                    console.log("Users table created");
                }
            ); */
        }
    );

    return true;
}

/**
    * * This is the user modal, it is used to create, update, delete and get users from the firestore database.
    * * The user modal is used to store user data, such as steamID, userName, scores, uploadedBeatmaps, profilePicUrl, bannerPicUrl, bio, country, uniqueId, lastLogin and supporter.
    * @returns {Object} - The user modal.
*/
function CreateUserModal(
    steamId = "",
    userName = "",
    scores = {},
    uploadedBeatmaps = {},
    profilePicUrl = "",
    bannerPicUrl = "",
    bio = "",
    country = "",
    uniqueId = "0",
    lastLogin = Date.now()
) {
    var user = {
        steamId: steamId,
        userName: userName,
        scores: scores,
        uploadedBeatmaps: uploadedBeatmaps,
        profilePicUrl: profilePicUrl,
        bannerPicUrl: bannerPicUrl,
        bio: bio,
        country: country,
        uniqueId: uniqueId,
        lastLogin: lastLogin,

        // Optional
        supporter: false,
    }

    return user;
}

/**
    * * This creates a test user, it is used to test the user modal and the firestore database.
    * * The test user is created with a steamID, userName, scores, uploadedBeatmaps, profilePicUrl, bannerPicUrl, bio, country, uniqueId, lastLogin and supporter.
    * * This function only needs to be called once at the start of development.
    * @returns {Object} - The test user.
*/
function createTestUser() {
    const test = {
        steamId: "test_STEAMID",
        userName: "Test User",
        scores: {},
        uploadedBeatmaps: {},
        profilePicUrl: "",
        bannerPicUrl: "",
        bio: "",
        country: "",
        uniqueId: "" + 1, // automatically generated, given at the create user request (stored locally)
        lastLogin: Date.now(),

        // Optional
        supporter: false,
    }

    // add to database if not already there (mysql) (WE ARE ALREADY IN THE USERS DATABASE)
    /* con.query(
        "SELECT * FROM users WHERE steamId = '" + test.steamId + "'",
        function(err, result) {
            if (err) throw err;
            if (result.length == 0) {
                con.query(
                    // MYSQL2 DOESN'T SUPPORT BOOLEAN VALUES, SO WE USE 0 AND 1
                    "INSERT INTO users (steamId, userName, scores, uploadedBeatmaps, profilePicUrl, bannerPicUrl, bio, country, uniqueId, lastLogin, supporter) VALUES ('" 
                    + test.steamId + "', '" + test.userName + "', '" + JSON.stringify(test.scores) + "', '" + JSON.stringify(test.uploadedBeatmaps) + "', '" 
                    + test.profilePicUrl + "', '" + test.bannerPicUrl + "', '" + test.bio + "', '" + test.country + "', '" + test.uniqueId + "', '" + 
                    test.lastLogin + "', " + (test.supporter ? 1 : 0) + ")",

                    function(err, result) {
                        if (err) throw err;
                    }
                );
            }
        }
    ) */

    return test;
}

/**
 * Checks for a users existence in the database
 * @param {string} steamId
 * @returns {boolean}
*/
function checkUserExists(steamId) {
    var exists = false;

    con.query(
        "SELECT * FROM users WHERE steamId = '" + steamId + "'",
        function(err, result) {
            if (err) throw err;
            if (result.length > 0) {
                exists = true;
            }
        }
    );

    return exists;
}

/**
    * This creates a user and adds it to the firestore database.
    * The user is created with a steamID, userName, scores, uploadedBeatmaps, profilePicUrl, bannerPicUrl, bio, country, uniqueId, lastLogin and supporter.
    * @param {Object} user - The user to create.
*/
function createUser(user) {
    console.log("Creating user: " + user);

    con.query(
        "SELECT * FROM users WHERE steamId = '" + user.steamId + "'",
        function(err, result) {
            if (err) throw err;
            if (result.length == 0) {
                con.query(
                    // MYSQL2 DOESN'T SUPPORT BOOLEAN VALUES, SO WE USE 0 AND 1
                    "INSERT INTO users (steamId, userName, scores, uploadedBeatmaps, profilePicUrl, bannerPicUrl, bio, country, uniqueId, lastLogin, supporter) VALUES ('" 
                    + user.steamId + "', '" + user.userName + "', '" + JSON.stringify(user.scores) + "', '" + JSON.stringify(user.uploadedBeatmaps) + "', '" 
                    + user.profilePicUrl + "', '" + user.bannerPicUrl + "', '" + user.bio + "', '" + user.country + "', '" + user.uniqueId + "', '" + 
                    user.lastLogin + "', " + (user.supporter ? 1 : 0) + ")",

                    function(err, result) {
                        if (err) throw err;
                    }
                );
            }
        }
    )
}

/**
    * * This updates a user in the firestore database.
    * * The user is updated with a steamID, userName, scores, uploadedBeatmaps, profilePicUrl, bannerPicUrl, bio, country, uniqueId, lastLogin and supporter.
    * * The user is found by the uniqueId.
    * @param {Object} user - The user to update.
    * @returns {null} - Returns nothing. Only updates the user in the database.
*/
function updateUser(user) {
    console.log("Updating user: " + user);

    con.query(
        "SELECT * FROM users WHERE uniqueId = '" + user.uniqueId + "'",
        function(err, result) {
            if (err) throw err;
            if (result.length > 0) {
                con.query(
                    "UPDATE users SET steamId = '" + user.steamId + "', userName = '" + user.userName + "', scores = '" + JSON.stringify(user.scores) + "', uploadedBeatmaps = '" + JSON.stringify(user.uploadedBeatmaps) + "', profilePicUrl = '" + user.profilePicUrl + "', bannerPicUrl = '" + user.bannerPicUrl + "', bio = '" + user.bio + "', country = '" + user.country + "', lastLogin = '" + user.lastLogin + "', supporter = " + (user.supporter ? 1 : 0) + " WHERE uniqueId = '" + user.uniqueId + "'",
                    function(err, result) {
                        if (err) throw err;
                    }
                );
            }
        }
    );
}

/**
    ** This deletes a user from the firestore database.
    * @param {Object} user - The user to delete.
    * @returns {boolean} - If the user was deleted.
*/
function deleteUser(user) {
    console.log("Deleting user: " + user);

    var deleted = false;

    con.query(
        "SELECT * FROM users WHERE uniqueId = '" + user.uniqueId + "'",
        function(err, result) {
            if (err) throw err;
            if (result.length > 0) {
                con.query(
                    "DELETE FROM users WHERE uniqueId = '" + user.uniqueId + "'",
                    function(err, result) {
                        if (err) throw err;
                        deleted = true;
                    }
                );
            }
        }
    );

    return deleted;
}

/**
    * * This function prints the test user to the console, it is used to test the user modal and the firestore database.
    * * The test user is found by the steamID in the database.
    * * This also tests the functionallity of the getUser function. 
    * * Can be used to check if the database is working correctly.
    * @returns {null} - Returns nothing. Only prints to console.
*/
function printTestUser() {
    // find test user from steamID in database
    
    con.query(
        "SELECT * FROM users WHERE steamId = 'test_STEAMID'",
        function(err, result) {
            if (err) throw err;
            if (result.length > 0) {
                console.log("Test user found: " + result[0].userName);
            }
        }
    );
}

/**
    * * This gets a user from the firestore database.
    * * The user is found by the steamID.
    * @param {string} steamID - The steamID of the user.
    * @returns {Object} - The user.
*/
async function getUser(steamID) {
    // like printTestUser but returns the user instead of printing it
    var user = null;

    const [rows, fields] = await con.promise().query(
        "SELECT * FROM users WHERE steamId = '" + steamID + "'"
    );

    if (rows.length > 0) {
        user = CreateUserModal(
            rows[0].steamId,
            rows[0].userName,
            JSON.parse(rows[0].scores),
            JSON.parse(rows[0].uploadedBeatmaps),
            rows[0].profilePicUrl,
            rows[0].bannerPicUrl,
            rows[0].bio,
            rows[0].country,
            rows[0].uniqueId,
            rows[0].lastLogin,
            rows[0].supporter
        );
    }

    return user;
}

/** 
    * * This gets a list of users from the firestore database.
    * * The list is between the start and end index.
    * @param {int} start - The start index of the list.
    * @param {int} end - The end index of the list.
    * @returns {Array} users - The list of users.
*/
async function getUsers(start, end) {
    
    var users = [];

    const [rows, fields] = await con.promise().query(
        "SELECT * FROM users"
    );

    // if end is greater than the amount of users, set it to the amount of users
    end = end > rows.length ? rows.length : end;

    console.log("Rows length: " + rows.length, "Start: " + start, "End: " + end);
    for (var i = start-1; i < end; i++) {
        var user = CreateUserModal(
            rows[i].steamId,
            rows[i].userName,
            JSON.parse(rows[i].scores),
            JSON.parse(rows[i].uploadedBeatmaps),
            rows[i].profilePicUrl,
            rows[i].bannerPicUrl,
            rows[i].bio,
            rows[i].country,
            rows[i].uniqueId,
            rows[i].lastLogin,
            rows[i].supporter
        );

        users.push(user);

        console.log("User: " + user.userName);
    }

    console.log("Users: " + users);
    
    return users;
}

export { setupApp, checkUserExists, createUser, updateUser, deleteUser, getUser, CreateUserModal, createTestUser, printTestUser, getUsers }