// Libraries
import express from 'express';
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import dotenv from 'dotenv';
dotenv.config();

// Modules
// load modals/UserModal.ts
// Force rebuild
import { setupApp, getUser, createUser, updateUser, deleteUser, printTestUser, getUsers, createTestUser } from './modals/UserModule.js';

/* const firebaseConfig = {
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
setupApp(firebaseApp); */
/* 
var mysql = require('mysql'); */ // use import instead of require
import mysql from 'mysql2';

var certDataFile = process.env.DB_CERT; // file path to the certificate
import fs from 'fs';
// read certificate file
var certData = fs.readFileSync(certDataFile);
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: {
        ca: certData
    },
});

// print connection status
con.connect(function(err) {
    if (err) throw err;
    console.log(`Connected to database ${process.env.DB_NAME}`);
    con.query("SET SQL_REQUIRE_PRIMARY_KEY=OFF") // disable primary key requirement

    // create users database if it doesn't exist
    /* con.query("CREATE DATABASE IF NOT EXISTS users", function (err, result) {
        if (err) throw err;
    }); */
});

setupApp(con);

// This both tests if the database is working, and checks if we can find a user from their SteamID
/* printTestUser(); */

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

var TEMPLATE_HTML_CODE = `
<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rit API Server</title>

    <!--Get bootstraps-->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.22/css/dataTables.bootstrap4.min.css">
    
    <!--Get jQuery-->
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.22/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.22/js/dataTables.bootstrap4.min.js"></script>

    <!-- meta -->
    <meta name="og:title" content="Rit API Server | <REPLACE ME TITLE>">
    <meta name="og:description" content="<REPLACE ME DESC>">
    <meta name="keywords" content="Rit, API, Server">
    <meta name="author" content="Rit">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="Content-Language" content="en">
</head>

<body>
    <style>
        body {
            margin: 20px;
            padding: 20px;
            background-color: #f8f9fa;
        }
    </style>
    <REPLACE ME HTML>
</body>

</html>
`

/*
    * This is the main entry point for the API.
    * We will define all the routes and endpoints here.
    * We will also add some basic functionality to test the API.
*/

const __dirname = process.cwd() + "/";

app.get("/", (req, res) => { // No request parameters. Simply return a html file.
    // return public/index.html
    res.sendFile(__dirname + "public/index.html");
});

app.get("/api/v1/test_connection", (req, res) => {
    res.json({ 
        message: "GET test_connection", 
        code: 200
    });
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
app.get("/api/v1/users", async (req, res) => {
    var start = req.query.start || 1;
    var limit = req.query.limit || 25;

    // Get users from start to end
    var users = await getUsers(start, limit);
    res.json(
        { 
            message: "GET all users", 
            users: users ,
            code: users ? 200 : 404
        }       
    );
});

/**
    * Just the favicon.ico file.
    * Used by browsers to display the favicon.
    * We can use the default favicon or add our own.
*/
app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "public/favicon.ico");
});

/*
    * HTML Variant of the above endpoint.
    * Just returns a simple html table with all the users.
    * Used by non-developers to view the data in a more readable format.
*/
app.get("/api/v1/users/html", async (req, res) => {
    var start = req.query.start || 1;
    var limit = req.query.limit || 25;

    // Get users from start to end
    var users = await getUsers(start, limit);
    var newHtml = TEMPLATE_HTML_CODE.replace("<REPLACE ME TITLE>", "Users")
                                    .replace("<REPLACE ME DESC>", "Get all users")
                                    .replace("<REPLACE ME HTML>", "<table id='usersTable' class='table table-striped table-bordered'><thead><tr><th>Steam ID</th><th>Username</th><th>Profile Picture</th></tr></thead><tbody>");
    users.forEach(user => {
        /* newHtml += `<tr><td>${user.steamId}</td><td>${user.userName}</td><td><img src='${user.profilePicture}'></td></tr>`; */
        // display all the info
        newHtml += `<tr><td>${user.steamId}</td><td>${user.userName}</td><td><img src='${user.profilePicture}'></td></tr>`;
    });

    newHtml += "</tbody></table>";
    res.send(newHtml); 
});

/*
    * Get a user by id. Used by the website to display user information.
    * This endpoint should also return the user's profile picture under a url like /api/v1/users/:id/picture.
    * Since we use Steam, we can use Steams data to get the profile picture.
    * We can also add a field to specify the size of the picture (small, medium, large).
    ? For example, /api/v1/users/:id/picture?size=medium
*/
app.get("/api/v1/users/:id", async (req, res) => {
    /* var user = getUser(req.params.id); */
    // wait until the user is retrieved
    var user = await getUser(req.params.id);
    // 
    res.json(
        { 
            message: `GET user with id ${req.params.id || "{UNKNOWN ID}"}`, 
            user: user,
            code: user ? 200 : 404
        }
    );
});

/*
    * HTML Variant of the above endpoint.
    * Just returns a simple html table with the user.
    * Used by non-developers to view the data in a more readable format.
*/
app.get("/api/v1/users/:id/html", async (req, res) => {
    var user = await getUser(req.params.id);
    user = user.data();
    var newHtml = TEMPLATE_HTML_CODE.replace("<REPLACE ME TITLE>", "User")
                                    .replace("<REPLACE ME DESC>", `Get user with id ${req.params.id || "{UNKNOWN ID}"}`)
                                    .replace("<REPLACE ME HTML>", `<table id='usersTable' class='table table-striped table-bordered'><thead><tr><th>Steam ID</th><th>Username</th><th>Profile Picture</th></tr></thead><tbody><tr><td>${user.steamId}</td><td>${user.userName}</td><td><img src='${user.profilePicture}'></td></tr></tbody></table>`);
    res.sendFile(newHtml); 
});

/*
    * Create/Update a user. Used for registration and updating user information.
    * This endpoint should be protected and only accessible by authenticated users (Admins and the user themselves).
    * We can add validation to ensure the user data is correct before adding it to the database.
    * For example, we can check if the email is valid, if the username is unique, etc.
    * We can also add a field to specify the action (register, update).
    ? For example, /api/v1/users?action=register
*/
app.post("/api/v1/users", async (req, res) => {
    // is the API_KEY parameter the same as process.env.RIT_API_KEY?
    console.log("Yeah.")
    if (req.query.API_KEY != process.env.RIT_API_KEY) {
        res.json({
            message: "Invalid API Key",
            code: 401
        });
        return;
    }

    var user = await createUser(req.body);
    res.json({
        message: "POST new user",
        user: user.data(),
        code: user ? 200 : 404
    });
    /* res.json({
        message: "POST new user | NOT IMPLEMENTED YET",
        code: 501
    }); */
});

/*
    * Delete a user. Used for deleting a user account.
    * This endpoint should be protected and only accessible by authenticated users (Admins and the user themselves).
    * We can add a confirmation step to avoid accidental deletions.
    * We can also add a reason field to specify why the user is being deleted.
    ? For example, /api/v1/users/:id?reason=account-closed
*/
app.delete("/api/v1/users/:id", (req, res) => {
    res.json({
        message: `DELETE user with id ${req.params.id || "{UNKNOWN ID}"} | NOT IMPLEMENTED YET`,
        code: 501
    });
});

/*
    * Report a user. Used for reporting inappropriate or incorrect user accounts.
    * This endpoint should be accessible by all users, even unauthenticated ones.
    * We can add a reason field to specify why the user is being reported.
    ? For example, /api/v1/users/:id/report?reason=inappropriate-content
*/
app.post("/api/v1/users/:id/report", (req, res) => {
    res.json({ 
        message: `REPORT user with id ${req.params.id || "{UNKNOWN ID}"} for reason: ${req.body.reason || "{NO REASON}"}`,
        code: 200
    });
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
    res.json({ 
        message: "GET all beatmaps | NOT IMPLEMENTED YET",
        code: 501
    });
});

/*
    * We can also add a preview file for the beatmap to allow users to listen to it before downloading.
    * The preview file can be a short audio clip of the beatmap.
    * The preview file can be accessed under a url like /api/v1/beatmaps/:id/preview.
    ? For example, /api/v1/beatmaps/123
    ! This is just an example. Preview files may or may not be added to the database.
*/
app.get("/api/v1/beatmaps/:id", (req, res) => {
    res.json({
        message: `GET beatmap with id ${req.params.id || "{UNKNOWN ID}"} | NOT IMPLEMENTED YET`,
        code: 501
    });
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
    res.json({
        message: "POST new beatmap | NOT IMPLEMENTED YET",
        code: 501
    });
});

/*
    * Delete a beatmap. Used for removing a beatmap from the database.
    * This endpoint should be protected and only accessible by authenticated users.
    * We can add a confirmation step to avoid accidental deletions.
    * We can also add a reason field to specify why the beatmap is being deleted.
    ? For example, /api/v1/beatmaps/:id?reason=incorrect-info
*/
app.delete("/api/v1/beatmaps/:id", (req, res) => {
    res.json({
        message: `DELETE beatmap with id ${req.params.id || "{UNKNOWN ID}"} | NOT IMPLEMENTED YET`,
        code: 501
    });
});

/*
    * Report a beatmap. Used for reporting inappropriate or incorrect beatmaps.
    * This endpoint should be accessible by all users, even unauthenticated ones.
    * We can add a reason field to specify why the beatmap is being reported.
    ? For example, /api/v1/beatmaps/:id/report?reason=inappropriate-content
*/
app.post("/api/v1/beatmaps/:id/report", (req, res) => {
    res.json({
        message: `REPORT beatmap with id ${req.params.id || "{UNKNOWN ID}"} for reason: ${req.body.reason || "{NO REASON}"} | NOT IMPLEMENTED YET`,
        code: 501
    });
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
    res.json({
        message: `GET all scores for beatmap with id ${req.params.id || "{UNKNOWN ID}"} | NOT IMPLEMENTED YET`,
        code: 501
    })
});

/*
    * Get a score by id. Used by the website to display score information.
    * This endpoint should also return the user's information and the beatmap information.
    * We can add a field to specify the action (get, update).
    ? For example, /api/v1/scores/:id?action=get
*/
app.get("/api/v1/scores/:id", (req, res) => {
    res.json({
        message: `GET score with id ${req.params.id || "{UNKNOWN ID}"} | NOT IMPLEMENTED YET`,
        code: 501
    })
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
    res.json({
        message: `POST new score for beatmap with id ${req.params.id || "{UNKNOWN ID}"} | NOT IMPLEMENTED YET`,
        code: 501
    })
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
    res.json({
        message: `DELETE score with id ${req.params.id || "{UNKNOWN ID}"} | NOT IMPLEMENTED YET`,
        code: 501
    });
});

/*
    * Report a score. Used for reporting falsified or incorrect scores.
    * This endpoint should be accessible by all users, even unauthenticated ones.
    * We can add a reason field to specify why the score is being reported.
    ? For example, /api/v1/scores/:id/report?reason=falsified-score
*/
app.post("/api/v1/scores/:id/report", (req, res) => {
    res.json({
        message: `REPORT score with id ${req.params.id || "{UNKNOWN ID}"} for reason: ${req.body.reason || "{NO REASON}"} | NOT IMPLEMENTED YET`,
        code: 501
    });
});
