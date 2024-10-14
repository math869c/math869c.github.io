const { google } = require('googleapis');
const path = require('path');

// Load credentials from JSON file
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../config/credentials.json'), // Adjust the path as necessary
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// The ID of the spreadsheet (replace with your own)
const spreadsheetId = '1JNtFug8MmMhH-_-23Kx0nqyl7CvA-e7t9Gg-_AIHzLU';

// Function to add a review to Google Sheets
async function addReview(place, rating, review) {
    try {
        const sheets = google.sheets({ version: 'v4', auth });

        // Get the current date and time
        const createdAt = new Date().toISOString();

        // Append the new review to the Google Sheet
        console.log("Attempting to add review to Google Sheets:", { place, rating, review, createdAt });

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:D', // Adjust range as necessary
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[place, rating, review, createdAt]]
            }
        });

        console.log("Google Sheets API response:", response.data);

        return { success: true, message: "Review added successfully!" };
    } catch (error) {
        console.error("Error occurred while adding review:", error.message);
        return { success: false, message: "Failed to add review", error: error.message };
    }
}

// Function to fetch all reviews from Google Sheets
async function getAllReviews() {
    try {
        const sheets = google.sheets({ version: 'v4', auth });

        // Fetch data from the Google Sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A:D' // Adjust range as necessary
        });

        const rows = response.data.values;

        if (rows.length === 0) {
            return { success: true, reviews: [], message: 'No reviews found.' };
        }

        // Map rows to review objects
        const reviews = rows.map((row) => ({
            place: row[0],
            rating: row[1],
            review: row[2],
            createdAt: row[3]
        }));

        return { success: true, reviews };
    } catch (error) {
        console.error("Error fetching reviews:", error.message);
        return { success: false, message: "Failed to fetch reviews", error: error.message };
    }
}

// Export functions
module.exports = {
    addReview,
    getAllReviews
};
