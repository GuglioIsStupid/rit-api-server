const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
    // return public/index.html
    res.sendFile(__dirname + "/public/index.html");
});

/* API Endpoints */

/* API ROUTE | USERS */

// Get all users. Used for leaderboards, admin panel, etc.
// This endpoint should be paginated to avoid sending too much data at once.
// We can add a starting index and an ending index as query parameters to specify the range of users to return.
// defaults to 1-25.
app.get("/api/v1/users", (req, res) => {
    res.json({ message: "GET all users" });
});

// Get a user by id. Used by the website to display user information.
// This endpoint should also return the user's profile picture under a url like /api/v1/users/:id/picture.
// Since we use Steam, we can use Steams data to get the profile picture.
app.get("/api/v1/users/:id", (req, res) => {
    res.json({ message: `GET user with id ${req.params.id || "{UNKNOWN ID}"}` });
});

// Create/Update a user. Used for registration and updating user information.
// This endpoint should be protected and only accessible by authenticated users (Admins and the user themselves).
// We can add validation to ensure the user data is correct before adding it to the database.
app.post("/api/v1/users", (req, res) => {
    res.json({ message: "POST new user" });
});

// Delete a user. Used for deleting a user account.
// This endpoint should be protected and only accessible by authenticated users (Admins and the user themselves).
// We can add a confirmation step to avoid accidental deletions.
app.delete("/api/v1/users/:id", (req, res) => {
    res.json({ message: `DELETE user with id ${req.params.id || "{UNKNOWN ID}"}` });
});

// Report a user. Used for reporting inappropriate or incorrect user accounts.
// This endpoint should be accessible by all users, even unauthenticated ones.
// We can add a reason field to specify why the user is being reported.
app.post("/api/v1/users/:id/report", (req, res) => {
    res.json({ message: `REPORT user with id ${req.params.id || "{UNKNOWN ID}"} for reason: ${req.body.reason || "{NO REASON}"}` });
});

/* API ROUTE | BEATMAPS */

// Get all beatmaps. Used by the website to display all beatmaps.
// This endpoint should be paginated to avoid sending too much data at once.
// For example, we can use query parameters to specify the page number and the number of items per page.
app.get("/api/v1/beatmaps", (req, res) => {
    res.json({ message: "GET all beatmaps" });
});

// Get a beatmap by id. Used by the website to display beatmap information.
// This endpoint should also return the beatmap file for download under a url like /api/v1/beatmaps/:id/file.
app.get("/api/v1/beatmaps/:id", (req, res) => {
    res.json({ message: `GET beatmap with id ${req.params.id || "{UNKNOWN ID}"}` });
});

// Create/Update a beatmap. Used for uploading new beatmaps and updating existing ones.
// This endpoint should be protected and only accessible by authenticated users.
// Reason being that we don't want random users to upload beatmaps. All beatmaps should be reviewed before being added to the database.
app.post("/api/v1/beatmaps", (req, res) => {
    res.json({ message: "POST new beatmap" });
});

// Delete a beatmap. Used for removing a beatmap from the database.
// This endpoint should be protected and only accessible by authenticated users.
// We can add a confirmation step to avoid accidental deletions.
app.delete("/api/v1/beatmaps/:id", (req, res) => {
    res.json({ message: `DELETE beatmap with id ${req.params.id || "{UNKNOWN ID}"}` });
});

// Report a beatmap. Used for reporting inappropriate or incorrect beatmaps.
// This endpoint should be accessible by all users, even unauthenticated ones.
// We can add a reason field to specify why the beatmap is being reported.
app.post("/api/v1/beatmaps/:id/report", (req, res) => {
    res.json({ message: `REPORT beatmap with id ${req.params.id || "{UNKNOWN ID}"} for reason: ${req.body.reason || "{NO REASON}"}` });
});

/* API ROUTE | SCORES */

// Get all scores for a beatmap. Used by the website to display the leaderboard for a specific beatmap.
// This endpoint should be paginated to avoid sending too much data at once.
// We can add a starting index and an ending index as query parameters to specify the range of scores to return.
// defaults to 1-25.
app.get("/api/v1/beatmaps/:id/scores", (req, res) => {
    res.json({ message: `GET all scores for beatmap with id ${req.params.id || "{UNKNOWN ID}"}` });
});

// Get a score by id. Used by the website to display score information.
// This endpoint should also return the user's information and the beatmap information.
app.get("/api/v1/scores/:id", (req, res) => {
    res.json({ message: `GET score with id ${req.params.id || "{UNKNOWN ID}"}` });
});

// Create/Update a score. Used for submitting new scores and updating existing ones.
// This endpoint should be protected and only accessible by authenticated users.
// We can add validation to ensure the score data is correct before adding it to the database.
app.post("/api/v1/beatmaps/:id/scores", (req, res) => {
    res.json({ message: `POST new score for beatmap with id ${req.params.id || "{UNKNOWN ID}"}` });
});

// Delete a score. Used for removing a score from the database.
// This endpoint should be protected and only accessible by authenticated users.
// We can add a confirmation step to avoid accidental deletions.
app.delete("/api/v1/scores/:id", (req, res) => {
    res.json({ message: `DELETE score with id ${req.params.id || "{UNKNOWN ID}"}` });
});

// Report a score. Used for reporting falsified or incorrect scores.
// This endpoint should be accessible by all users, even unauthenticated ones.
// We can add a reason field to specify why the score is being reported.
app.post("/api/v1/scores/:id/report", (req, res) => {
    res.json({ message: `REPORT score with id ${req.params.id || "{UNKNOWN ID}"} for reason: ${req.body.reason || "{NO REASON}"}` });
});
