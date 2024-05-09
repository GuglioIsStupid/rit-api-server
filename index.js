// Libraries
import express from 'express';
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import dotenv from 'dotenv';
dotenv.config();

// Modules
// load modals/UserModal.ts
import { setupApp, getUser, createUser, updateUser, deleteUser, printTestUser } from './modals/UserModal.js';

// print user modal as a test
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
setupApp(firebaseApp);

printTestUser();

// Setting up the express app
const app = express(); 
app.use(express.json()); // Parse incoming JSON data

// Port to run the server on. Default is 3000.
const PORT = process.env.PORT || 3000; 

/*
    * Start up the server and listen on the specified port.
*/
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
    * This is the main entry point for the API.
    * We will define all the routes and endpoints here.
    * We will also add some basic functionality to test the API.
*/

app.get("/", (req, res) => { // No request parameters. Simply return a html file.
    // return public/index.html
    res.sendFile(__dirname + "/public/index.html");
});

/* API Endpoints */

/* 
    ! API ROUTE | USERS 
    * All user related endpoints will be defined here.
    * This includes getting user information, updating user information, deleting user accounts, etc.
    * We can also add endpoints for reporting users, viewing user statistics, etc.
*/

/*
    * Get all users. Used for leaderboards, admin panel, etc.
    * This endpoint should be paginated to avoid sending too much data at once.
    * We can add a starting index and an ending index as query parameters to specify the range of users to return.
    * defaults to 1-25.
    ? For example, /api/v1/users?start=1&limit=25
*/
app.get("/api/v1/users", (req, res) => {
    res.json({ message: "GET all users" });
});

/*
    * Get a user by id. Used by the website to display user information.
    * This endpoint should also return the user's profile picture under a url like /api/v1/users/:id/picture.
    * Since we use Steam, we can use Steams data to get the profile picture.
    * We can also add a field to specify the size of the picture (small, medium, large).
    ? For example, /api/v1/users/:id/picture?size=medium
*/
app.get("/api/v1/users/:id", (req, res) => {
    res.json({ message: `GET user with id ${req.params.id || "{UNKNOWN ID}"}` });
});

/*
    * Create/Update a user. Used for registration and updating user information.
    * This endpoint should be protected and only accessible by authenticated users (Admins and the user themselves).
    * We can add validation to ensure the user data is correct before adding it to the database.
    * For example, we can check if the email is valid, if the username is unique, etc.
    * We can also add a field to specify the action (register, update).
    ? For example, /api/v1/users?action=register
*/
app.post("/api/v1/users", (req, res) => {
    res.json({ message: "POST new user" });
});

/*
    * Delete a user. Used for deleting a user account.
    * This endpoint should be protected and only accessible by authenticated users (Admins and the user themselves).
    * We can add a confirmation step to avoid accidental deletions.
    * We can also add a reason field to specify why the user is being deleted.
    ? For example, /api/v1/users/:id?reason=account-closed
*/
app.delete("/api/v1/users/:id", (req, res) => {
    res.json({ message: `DELETE user with id ${req.params.id || "{UNKNOWN ID}"}` });
});

/*
    * Report a user. Used for reporting inappropriate or incorrect user accounts.
    * This endpoint should be accessible by all users, even unauthenticated ones.
    * We can add a reason field to specify why the user is being reported.
    ? For example, /api/v1/users/:id/report?reason=inappropriate-content
*/
app.post("/api/v1/users/:id/report", (req, res) => {
    res.json({ message: `REPORT user with id ${req.params.id || "{UNKNOWN ID}"} for reason: ${req.body.reason || "{NO REASON}"}` });
});

/* 
    ! API ROUTE | BEATMAPS 
    * All beatmap related endpoints will be defined here.
    * This includes getting beatmap information, uploading beatmaps, updating beatmaps, etc.
    * We can also add endpoints for reporting beatmaps, viewing beatmap statistics, etc.
*/

/*
    * Get all beatmaps. Used by the website to display all beatmaps.
    * This endpoint should be paginated to avoid sending too much data at once.
    * For example, we can use query parameters to specify the page number and the number of items per page.
    * defaults to 1-25.
    * We can also add filters like difficulty, genre, etc.
    ? For example, /api/v1/beatmaps?page=1&limit=25&difficulty=hard&genre=rock
*/
app.get("/api/v1/beatmaps", (req, res) => {
    res.json({ message: "GET all beatmaps" });
});

/*
    * We can also add a preview file for the beatmap to allow users to listen to it before downloading.
    * The preview file can be a short audio clip of the beatmap.
    * The preview file can be accessed under a url like /api/v1/beatmaps/:id/preview.
    ? For example, /api/v1/beatmaps/123
    ! This is just an example. Preview files may or may not be added to the database.
*/
app.get("/api/v1/beatmaps/:id", (req, res) => {
    res.json({ message: `GET beatmap with id ${req.params.id || "{UNKNOWN ID}"}` });
});

/*
    * Create/Update a beatmap. Used for uploading new beatmaps and updating existing ones.
    * This endpoint should be protected and only accessible by authenticated users.
    * Reason being that we don't want random users to upload beatmaps. All beatmaps should be reviewed before being added to the database.
    * We can add validation to ensure the beatmap data is correct before adding it to the database.
    ? For example, we can check if the title is unique, if the artist is valid, etc.
    * We can also add a field to specify the action (upload, update).
    ? For example, /api/v1/beatmaps?action=upload
*/
app.post("/api/v1/beatmaps", (req, res) => {
    res.json({ message: "POST new beatmap" });
});

/*
    * Delete a beatmap. Used for removing a beatmap from the database.
    * This endpoint should be protected and only accessible by authenticated users.
    * We can add a confirmation step to avoid accidental deletions.
    * We can also add a reason field to specify why the beatmap is being deleted.
    ? For example, /api/v1/beatmaps/:id?reason=incorrect-info
*/
app.delete("/api/v1/beatmaps/:id", (req, res) => {
    res.json({ message: `DELETE beatmap with id ${req.params.id || "{UNKNOWN ID}"}` });
});

/*
    * Report a beatmap. Used for reporting inappropriate or incorrect beatmaps.
    * This endpoint should be accessible by all users, even unauthenticated ones.
    * We can add a reason field to specify why the beatmap is being reported.
    ? For example, /api/v1/beatmaps/:id/report?reason=inappropriate-content
*/
app.post("/api/v1/beatmaps/:id/report", (req, res) => {
    res.json({ message: `REPORT beatmap with id ${req.params.id || "{UNKNOWN ID}"} for reason: ${req.body.reason || "{NO REASON}"}` });
});

/* 
    ! API ROUTE | SCORES 
    * All score related endpoints will be defined here.
    * This includes getting score information, submitting new scores, updating scores, etc.
    * We can also add endpoints for reporting scores, viewing score statistics, etc.
*/

/*
    * Get all scores for a beatmap. Used by the website to display the leaderboard for a specific beatmap.
    * This endpoint should be paginated to avoid sending too much data at once.
    * We can add a starting index and an ending index as query parameters to specify the range of scores to return.
    * defaults to 1-25.
    ? For example, /api/v1/beatmaps/:id/scores?start=1&limit=25
*/
app.get("/api/v1/beatmaps/:id/scores", (req, res) => {
    res.json({ message: `GET all scores for beatmap with id ${req.params.id || "{UNKNOWN ID}"}` });
});

/*
    * Get a score by id. Used by the website to display score information.
    * This endpoint should also return the user's information and the beatmap information.
    * We can add a field to specify the action (get, update).
    ? For example, /api/v1/scores/:id?action=get
*/
app.get("/api/v1/scores/:id", (req, res) => {
    res.json({ message: `GET score with id ${req.params.id || "{UNKNOWN ID}"}` });
});

/*
    * Create/Update a score. Used for submitting new scores and updating existing ones.
    * This endpoint should be protected and only accessible by authenticated users.
    * We can add validation to ensure the score data is correct before adding it to the database.
    ? For example, we can check if the score is valid, if the user exists, if the beatmap exists, etc.
    * We can also add a field to specify the action (submit, update).
    ? For example, /api/v1/beatmaps/:id/scores?action=submit
*/
app.post("/api/v1/beatmaps/:id/scores", (req, res) => {
    res.json({ message: `POST new score for beatmap with id ${req.params.id || "{UNKNOWN ID}"}` });
});

/*
    * Delete a score. Used for removing a score from the database.
    * This endpoint should be protected and only accessible by authenticated users.
    * We can add a confirmation step to avoid accidental deletions.
    ? For example, /api/v1/scores/:id
    * We can also add a reason field to specify why the score is being deleted.
    ? For example, /api/v1/scores/:id?reason=incorrect-info
*/
app.delete("/api/v1/scores/:id", (req, res) => {
    res.json({ message: `DELETE score with id ${req.params.id || "{UNKNOWN ID}"}` });
});

/*
    * Report a score. Used for reporting falsified or incorrect scores.
    * This endpoint should be accessible by all users, even unauthenticated ones.
    * We can add a reason field to specify why the score is being reported.
    ? For example, /api/v1/scores/:id/report?reason=falsified-score
*/
app.post("/api/v1/scores/:id/report", (req, res) => {
    res.json({ message: `REPORT score with id ${req.params.id || "{UNKNOWN ID}"} for reason: ${req.body.reason || "{NO REASON}"}` });
});
