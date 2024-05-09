// User Modal, firestore
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

var app = null;

function setupApp(firebaseApp) {
    app = firebaseApp;

    return true;
}

// user
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
        uniqueId: "", // automatically generated, given at the create user request (stored locally)
        lastLogin: Date.now(),

        // Optional
        supporter: false,
    }
}

function createTestUser() {
    return {
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
}

function printTestUser() {
    console.log(createTestUser())
}

// Create user
function createUser(user) {
    return db.collection("users").doc(user.steamId).set(user)
}

// Update user
function updateUser(user) {
    return db.collection("users").doc(user.steamId).update(user)
}

// Delete user
function deleteUser(steamId) {
    return db.collection("users").doc(steamId).delete()
}

// Get user
function getUser(steamId) {
    return db.collection("users").doc(steamId).get()
}

export { setupApp, createUser, updateUser, deleteUser, getUser, CreateUserModal, createTestUser, printTestUser }