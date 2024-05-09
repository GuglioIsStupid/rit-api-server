// User Modal, firestore
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {
    getFirestore,
    query,
    collection,
    getDocs,
    addDoc,
    where,
    updateDoc,
} from "firebase/firestore";
import { doc } from "firebase/firestore";

var app = null;
var db = null;

/**
    * * This function sets up the firebase app and firestore database.
    * * The app is used to connect to the firestore database.
    * * The database is used to store user data.
    * @param {Object} firebaseApp - The firebase app.
    * @returns {boolean} - If the app was set up.
*/
function setupApp(firebaseApp) {
    app = firebaseApp;

    db = getFirestore(app);

    return true;
}

/**
    * * This is the user modal, it is used to create, update, delete and get users from the firestore database.
    * * The user modal is used to store user data, such as steamID, userName, scores, uploadedBeatmaps, profilePicUrl, bannerPicUrl, bio, country, uniqueId, lastLogin and supporter.
    * @returns {Object} - The user modal.
*/
function CreateUserModal() {
    user = {
        steamId: "",
        userName: "",
        scores: {},
        uploadedBeatmaps: {},
        profilePicUrl: "",
        bannerPicUrl: "",
        bio: "",
        country: "",
        uniqueId: "0", // automatically generated, given at the create user request (stored locally)
        lastLogin: Date.now(),

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
        uniqueId: "" + Math.floor(Math.random() * 1000000000), // automatically generated, given at the create user request (stored locally)
        lastLogin: Date.now(),

        // Optional
        supporter: false,
    }

    // add test user to database if not exists
    getUser(test.uniqueId).then((doc) => {
        if (doc == null) {
            // add to users database
            createUser(test);
        } else {
            console.log("User already exists in database: " + test.uniqueId);
        }
    });

    return test;
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
    getUser("test_STEAMID").then((doc) => {
        if (doc != null) {
            console.log("Test user found: " + doc.data().userName);
        } else {
            console.log("Test user not found");
        }
    });
}

/**
    * This creates a user and adds it to the firestore database.
    * The user is created with a steamID, userName, scores, uploadedBeatmaps, profilePicUrl, bannerPicUrl, bio, country, uniqueId, lastLogin and supporter.
    * @param {Object} user - The user to create.
*/
async function createUser(user) {
    await addDoc(collection(db, "users"), user);
}

/**
    * * This updates a user in the firestore database.
    * * The user is updated with a steamID, userName, scores, uploadedBeatmaps, profilePicUrl, bannerPicUrl, bio, country, uniqueId, lastLogin and supporter.
    * * The user is found by the uniqueId.
    * @param {Object} user - The user to update.
*/
async function updateUser(user) {
    const userRef = doc(db, "users", user.uniqueId);
    await updateDoc(userRef, user);
}

/**
    ** This deletes a user from the firestore database.
    * @param {Object} user - The user to delete.
    * @returns {boolean} - If the user was deleted.
*/
async function deleteUser(user) {
    const userRef = doc(db, "users", user.uniqueId);
    await deleteDoc(userRef);
}

/**
    * * This gets a user from the firestore database.
    * * The user is found by the steamID.
    * @param {string} steamID - The steamID of the user.
    * @returns {Object} - The user.
*/
async function getUser(steamID) {
    const q = query(collection(db, "users"), where("steamId", "==", steamID));
    const querySnapshot = await getDocs(q);
    var user = null;
    querySnapshot.forEach((doc) => {
        user = doc;
    });

    return user;
}

/** 
    * * This gets a list of users from the firestore database.
    * * The list is between the start and end index.
    * @param {int} start - The start index of the list.
    * @param {int} end - The end index of the list.
    * @returns {Array} - The list of users.
*/
async function getUsers(start, end) {
    // get only amount of users between start and end
    const q = query(collection(db, "users"), where("uniqueId", ">=", start), where("uniqueId", "<=", end));
    const querySnapshot = await getDocs(q);

    var index = 0;
    var newQuerySnapshot = [];
    querySnapshot.forEach(async (doc) => {
        if (index >= start && index <= end) {
            newQuerySnapshot.push(doc);
        }
        index++;
        if (index > end) {
            return;
        }
    });

    return newQuerySnapshot;
}

export { setupApp, createUser, updateUser, deleteUser, getUser, CreateUserModal, createTestUser, printTestUser, getUsers }