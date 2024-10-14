const express = require('express');
const bodyParser = require('body-parser');
const { addReview, getAllReviews } = require('./models/review'); // Importing functions from review.js

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to add a new review (from form submission)
app.post('/api/reviews', async (req, res) => {
    const { place, rating, review } = req.body;

    if (!place || !rating || !review) {
        console.error("Validation error: Missing required fields");
        return res.status(400).json({ message: "All fields are required." });
    }

    // Add the review to Google Sheets
    try {
        const result = await addReview(place, rating, review);
        if (result.success) {
            return res.status(201).json({ message: result.message });
        } else {
            console.error("Error adding review:", result.message);
            return res.status(500).json({ message: result.message });
        }
    } catch (error) {
        console.error("Unexpected error in /api/reviews route:", error);
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
});

// Route to fetch all reviews
app.get('/api/reviews', async (req, res) => {
    // Fetch all reviews from Google Sheets
    try {
        const result = await getAllReviews();
        if (result.success) {
            return res.status(200).json(result.reviews);
        } else {
            console.error("Error fetching reviews:", result.message);
            return res.status(500).json({ message: result.message });
        }
    } catch (error) {
        console.error("Unexpected error in /api/reviews route:", error);
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
