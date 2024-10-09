const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

let reviews = []; // Temporary in-memory store (You'd use a database here)

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Endpoint to add a review
app.post('/api/reviews', (req, res) => {
    const { place, rating, review } = req.body;
    if (!place || !rating || !review) {
        return res.status(400).json({ message: "All fields are required." });
    }
    reviews.push({ place, rating, review });
    res.status(201).json({ message: "Review added successfully!" });
});

// API Endpoint to fetch reviews
app.get('/api/reviews', (req, res) => {
    const { place } = req.query;
    if (place && place !== 'all') {
        const filteredReviews = reviews.filter(r => r.place === place);
        return res.json(filteredReviews);
    }
    res.json(reviews);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
