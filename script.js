const stars = document.querySelectorAll(".star");
const rating = document.getElementById("rating");
const reviewText = document.getElementById("review");
const submitBtn = document.getElementById("submit");
const reviewsContainer = document.getElementById("reviews");
const placeSelect = document.getElementById("place");

// Load saved reviews and rating from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  loadReviews(); // Load and display saved reviews
  const savedRating = localStorage.getItem("savedRating");
  if (savedRating) {
    rating.innerText = savedRating;
    stars.forEach((s, index) => {
      if (index < savedRating) {
        s.classList.add(getStarColorClass(savedRating));
      }
    });
  }
});

// Add click event listener to each star for rating
stars.forEach((star) => {
  star.addEventListener("click", () => {
    const value = parseInt(star.getAttribute("data-value"));
    rating.innerText = value;

    // Remove all existing classes from stars
    stars.forEach((s) => s.classList.remove("one", "two", "three", "four", "five"));

    // Add appropriate class to stars
    stars.forEach((s, index) => {
      if (index < value) {
        s.classList.add(getStarColorClass(value));
      }
    });

    // Save rating in localStorage
    localStorage.setItem("savedRating", value);

    stars.forEach((s) => s.classList.remove("selected"));
    star.classList.add("selected");
  });
});

// Submit review functionality
submitBtn.addEventListener("click", () => {
  const review = reviewText.value;
  const userRating = parseInt(rating.innerText);
  const selectedPlace = placeSelect.value;

  if (!userRating || !review) {
    alert("Please select a rating and provide a review before submitting.");
    return;
  }

  if (userRating > 0) {
    // Create a review object
    const reviewObj = {
      place: selectedPlace,
      rating: userRating,
      review: review
    };

    // Save review in localStorage
    saveReview(reviewObj);

    // Append the new review to the reviews container
    displayReview(reviewObj);

    // Reset form fields
    reviewText.value = "";
    rating.innerText = "0";
    stars.forEach((s) => s.classList.remove("one", "two", "three", "four", "five", "selected"));

    // Clear the saved rating in localStorage after submitting
    localStorage.removeItem("savedRating");
  }
});

// Save review to localStorage
function saveReview(reviewObj) {
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.push(reviewObj);
  localStorage.setItem("reviews", JSON.stringify(reviews));
}

// Load reviews from localStorage and display them
function loadReviews() {
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.forEach((reviewObj) => displayReview(reviewObj));
}

// Display a review in the reviews container
function displayReview(reviewObj) {
  const reviewElement = document.createElement("div");
  reviewElement.classList.add("review");
  reviewElement.innerHTML = `
    <p><strong>Place: ${reviewObj.place}</strong></p>
    <p><strong>Rating: ${reviewObj.rating}/5</strong></p>
    <p>${reviewObj.review}</p>
  `;
  reviewsContainer.appendChild(reviewElement);
}

// Function to get the appropriate class for star color based on rating value
function getStarColorClass(value) {
  switch (value) {
    case 1:
      return "one";
    case 2:
      return "two";
    case 3:
      return "three";
    case 4:
      return "four";
    case 5:
      return "five";
    default:
      return "";
  }
}
