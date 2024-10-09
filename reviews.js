const cups = document.querySelectorAll(".cup");
const ratingDisplay = document.getElementById("rating");
const reviewText = document.getElementById("review");
const submitBtn = document.getElementById("submit");
const reviewsContainer = document.getElementById("reviews");
const placeSelect = document.getElementById("place");

// Click event listener for each coffee cup
cups.forEach((cup, index) => {
    cup.addEventListener("click", () => {
        const value = index + 1;
        ratingDisplay.innerText = `${value}`;  // Update the displayed rating

        // Update visual feedback for all cups
        cups.forEach((c, idx) => {
            if (idx < value) {
                c.innerHTML = '&#2615;'; // Coffee mug symbol when selected
                c.classList.add("selected"); // Add selected class up to the chosen cup
            } else {
                c.innerHTML = '&#9675;'; // Circle symbol when not selected
                c.classList.remove("selected"); // Remove selected class beyond the chosen cup
            }
        });
    });
});

// Submit button functionality
submitBtn.addEventListener("click", () => {
    const review = reviewText.value;
    const userRating = ratingDisplay.innerText.split('/')[0]; // Get the first part of the rating text

    if (!userRating || !review) {
        alert("Please select a rating and provide a review before submitting.");
        return;
    }

    // Create and display a review element
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review");
    reviewElement.innerHTML = `
        <p><strong>Place: ${placeSelect.value}</strong></p>
        <p><strong>Rating: ${userRating}/5</strong></p>
        <p>${review}</p>
    `;
    reviewsContainer.appendChild(reviewElement);

    // Reset the form after submitting
    reviewText.value = "";
    ratingDisplay.innerText = "0/5";
    cups.forEach((c) => {
        c.innerHTML = '&#9675;'; // Reset to circle symbol
        c.classList.remove("selected");
    });
});

submitBtn.addEventListener("click", async () => {
    const review = reviewText.value;
    const userRating = ratingDisplay.innerText.split('/')[0];
    const place = placeSelect.value;

    if (!userRating || !review) {
        alert("Please select a rating and provide a review before submitting.");
        return;
    }

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ place, rating: userRating, review }),
        });
        
        if (response.ok) {
            alert("Review submitted successfully!");
            // Optionally, fetch and display updated reviews here.
        }
    } catch (error) {
        console.error("Error submitting review:", error);
    }
});

// Fetch reviews when loading the page or changing place
async function loadReviews(place = 'all') {
    try {
        const response = await fetch(`/api/reviews?place=${place}`);
        const reviews = await response.json();
        reviewsContainer.innerHTML = ''; // Clear old reviews

        reviews.forEach(({ place, rating, review }) => {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("review");
            reviewElement.innerHTML = `
                <p><strong>Place: ${place}</strong></p>
                <p><strong>Rating: ${rating}/5</strong></p>
                <p>${review}</p>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

// Initially load all reviews
loadReviews();

// Add event listener for place selection
placeSelect.addEventListener("change", (e) => {
    const selectedPlace = e.target.value;
    loadReviews(selectedPlace);
});

