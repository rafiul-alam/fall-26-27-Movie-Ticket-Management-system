
const movieSelect = document.getElementById("movie");

// Create movie preview section
const preview = document.createElement("div");
preview.style.marginTop = "20px";

const poster = document.createElement("img");
poster.style.width = "180px";
poster.style.height = "250px";
poster.style.objectFit = "cover";
poster.style.borderRadius = "12px";
poster.style.display = "none";
// Create IMDb rating element
const rating = document.createElement("p");
rating.style.fontSize = "17px";
rating.style.fontWeight = "bold";
rating.style.color = "#f5a623";
rating.style.marginTop = "10px";
rating.style.display = "none";

const trailerButton = document.createElement("button");
trailerButton.textContent = "▶ Watch Trailer";
trailerButton.style.display = "none";
trailerButton.style.marginTop = "12px";
trailerButton.style.padding = "12px 22px";
trailerButton.style.background = "#2455e8";
trailerButton.style.color = "white";
trailerButton.style.border = "none";
trailerButton.style.borderRadius = "8px";
trailerButton.style.cursor = "pointer";

const video = document.createElement("iframe");

video.style.width = "100%";
video.style.aspectRatio = "16 / 9";
video.style.height = "auto";
video.style.maxWidth = "100%";
video.style.marginTop = "20px";
video.style.borderRadius = "16px";
video.style.border = "none";
video.style.display = "none";
video.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
video.allowFullscreen = true;
preview.style.gridColumn = "1 / -1";
preview.style.width = "100%";
preview.style.boxSizing = "border-box";

preview.append(poster, rating, trailerButton, video);
movieSelect.insertAdjacentElement("afterend", preview);

// Movie selection
function updateMoviePreview() {
    const selected = movieData[movieSelect.value];

    video.src = "";
    video.style.display = "none";

    if (selected) {
        poster.src = selected.poster;
        poster.style.display = "block";
        rating.textContent = "IMDb Rating: " + selected.rating;
        rating.style.display = "block";
        trailerButton.style.display = "block";
    } else {
        poster.removeAttribute("src");
        poster.style.display = "none";
        rating.style.display = "none";
        trailerButton.style.display = "none";
    }
}

movieSelect.addEventListener("change", updateMoviePreview);
updateMoviePreview();

// Play trailer
trailerButton.addEventListener("click", function () {
    const selected = movieData[movieSelect.value];

    if (selected) {
        video.src = "https://www.youtube.com/embed/" +
            selected.trailer + "?autoplay=1";

        video.style.display = "block";
    }
});
// Ticket Price Calculation

const quantityInput = document.getElementById("quantity");
const categoryInput = document.getElementById("category");
const priceSummary = document.getElementById("priceSummary");

const seats = document.querySelectorAll('input[name="seat[]"]');

// Ticket prices are declared once in data.js and reused here.

function updatePrice() {

    const quantity = Number(quantityInput.value);
    const category = categoryInput.value;

    const selectedSeats = document.querySelectorAll(
        'input[name="seat[]"]:checked'
    );

    const seatCount = selectedSeats.length;

    if (!quantity || !category || seatCount === 0) {
        priceSummary.textContent = "Select your tickets and seats to see the price.";
        return;
    }

    if (seatCount !== quantity) {
        priceSummary.textContent =
            `You selected ${seatCount} seats. Please select ${quantity} seats.`;
        return;
    }

    const price = ticketPrices[category];
    const total = price * seatCount;

    priceSummary.textContent =
        `Tickets: ${seatCount} | Category: ${category} | Total Price: ৳${total}`;
}

// Listen for changes

quantityInput.addEventListener("input", updatePrice);
categoryInput.addEventListener("change", updatePrice);

// Listen for seat selection changes
document.querySelectorAll('input[name="seat[]"]').forEach(seat => {
    seat.addEventListener("change", updatePrice);
});

// Calculate price when the page loads
updatePrice();



// Booking Form Validation
const bookingForm = document.getElementById("bookingForm");
const showDate = document.getElementById("date");
const showTime = document.getElementById("time");

// Use our custom validation messages
bookingForm.noValidate = true;

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const quantity = Number(quantityInput.value);

    const selectedSeats = document.querySelectorAll(
        'input[name="seat[]"]:checked'
    );

    // 1. Check Movie
    if (movieSelect.value === "") {
        alert("Please select a movie.");
        movieSelect.focus();
        return;
    }

    // 2. Check Show Date
    if (!showDate.value) {
        alert("Please select a show date.");
        showDate.focus();
        return;
    }

    // 3. Check Show Time
    if (!showTime.value) {
        alert("Please select a show time.");
        showTime.focus();
        return;
    }
    // Check Seat Category
    if (!categoryInput.value) {
        alert("Please select a seat category.");
        categoryInput.focus();
        return;
    }
    // 4. Check Number of Tickets
    if (!Number.isInteger(quantity) || quantity < 1) {
        alert("Please enter a valid number of tickets.");
        quantityInput.focus();
        return;
    }

    // 5. Check Selected Seats
    if (selectedSeats.length !== quantity) {
        alert(
            "You selected " + selectedSeats.length +
            " seats. Please select exactly " + quantity + " seats."
        );
        return;
    }

    // 6. Check Buyer Information
    const buyerNameInput = document.getElementById("name");
    const buyerEmailInput = document.getElementById("email");
    const buyerPhoneInput = document.getElementById("phone");

    if (buyerNameInput.value.trim() === "") {
        alert("Please enter your full name.");
        buyerNameInput.focus();
        return;
    }


    if (!isValidEmail(buyerEmailInput.value.trim())) {
        alert("Please enter a valid email address.");
        buyerEmailInput.focus();
        return;
    }


    if (!isValidPhone(buyerPhoneInput.value.trim())) {
        alert("Please enter a valid phone number.");
        buyerPhoneInput.focus();
        return;
    }


    // 7. Check Payment Method
    const paymentInput = document.querySelector(
        'input[name="payment"]:checked'
    );

    if (!paymentInput) {
        alert("Please select a payment method.");
        document.getElementById("bkash").focus();
        return;
    }



    // All validations passed

    // Generate Booking ID
    const bookingId = "BK" + Date.now();

    // Calculate Total Price
    const category = categoryInput.value;
    const totalPrice = ticketPrices[category] * quantity;

    // Create Booking Object
    const booking = {
        bookingId: bookingId,
        movie: movieSelect.value,
        showDate: showDate.value,
        showTime: showTime.value,
        quantity: quantity,
        category: category,
        seats: Array.from(selectedSeats).map(function (seat) {
            return seat.value;
        }),
        totalPrice: totalPrice,
        buyerName: buyerNameInput.value.trim(),
        buyerEmail: buyerEmailInput.value.trim(),
        buyerPhone: buyerPhoneInput.value.trim(),
        paymentMethod: paymentInput.value,
        status: "Confirmed",
        bookingDate: new Date().toLocaleDateString()
    };

    // Save Booking in LocalStorage
    let bookings = JSON.parse(
        localStorage.getItem("movieBookings")
    ) || [];

    bookings.push(booking);

    localStorage.setItem(
        "movieBookings",
        JSON.stringify(bookings)
    );
    renderBookings();
    renderBookingHistory();
    renderDigitalTicket();

    alert(
        "Booking Successful! Your Booking ID is: " + bookingId
    );

});

// Display Bookings in My Bookings Table
const bookingSearch = document.getElementById("bookingSearch");

function renderBookings(searchTerm = "") {

    const bookingTableBody = document.getElementById("bookingTableBody");
    const bookings = JSON.parse(localStorage.getItem("movieBookings")) || [];
    bookingTableBody.innerHTML = "";

    const filteredBookings = bookings.filter(function (booking) {
        const searchText = searchTerm.toLowerCase();
        return (
            String(booking.bookingId || "").toLowerCase().includes(searchText) ||
            String(booking.movie || "").toLowerCase().includes(searchText)
        );
    });

    if (filteredBookings.length === 0) {
        bookingTableBody.innerHTML = bookings.length === 0
            ? '<tr><td colspan="8">No bookings available yet.</td></tr>'
            : '<tr><td colspan="8">No matching bookings found.</td></tr>';
        return;
    }

    filteredBookings.forEach(function (booking) {
        const row = document.createElement("tr");
        const seatNumbers = Array.isArray(booking.seats)
            ? booking.seats.join(", ")
            : (booking.seats || "—");

        const values = [
            booking.bookingId,
            booking.movie,
            booking.showDate,
            booking.showTime,
            seatNumbers,
            "৳" + booking.totalPrice,
            booking.status,
            "—"
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value ?? "—";
            row.appendChild(cell);
        });

        bookingTableBody.appendChild(row);
    });
}

bookingSearch.addEventListener("input", function () {
    renderBookings(bookingSearch.value.trim());
});

// Load Bookings When Page Opens
renderBookings();

// Display Booking History
function renderBookingHistory() {

    const historyTableBody = document.getElementById("historyTableBody");

    const bookings = JSON.parse(
        localStorage.getItem("movieBookings")
    ) || [];

    historyTableBody.innerHTML = "";

    if (bookings.length === 0) {
        historyTableBody.innerHTML =
            '<tr><td colspan="6">No booking history available.</td></tr>';
        return;
    }

    bookings.forEach(function (booking) {

        const row = document.createElement("tr");

        const seatNumbers = Array.isArray(booking.seats)
            ? booking.seats.join(", ")
            : booking.seats;

        const values = [
            booking.bookingId,
            booking.movie,
            booking.bookingDate || booking.showDate,
            seatNumbers,
            "৳" + booking.totalPrice,
            booking.status
        ];

        values.forEach(function (value) {

            const cell = document.createElement("td");
            cell.textContent = value || "—";
            row.appendChild(cell);

        });

        historyTableBody.appendChild(row);

    });
}

// Load Booking History
renderBookingHistory();

// Display Digital Ticket
function renderDigitalTicket() {

    const bookings = JSON.parse(
        localStorage.getItem("movieBookings")
    ) || [];

    // Get the latest booking
    const booking = bookings.length > 0
        ? bookings[bookings.length - 1]
        : null;

    if (!booking) {
        document.getElementById("ticketBookingId").textContent = "__________________";
        document.getElementById("ticketCustomerName").textContent = "__________________";
        document.getElementById("ticketMovieName").textContent = "__________________";
        document.getElementById("ticketShowDate").textContent = "__________________";
        document.getElementById("ticketShowTime").textContent = "__________________";
        document.getElementById("ticketSeatNumber").textContent = "__________________";
        document.getElementById("ticketPrice").textContent = "__________________";
        document.getElementById("qrCodeArea").innerHTML =
            "<p>QR Code will be displayed after a successful booking.</p>";
        return;
    }

    // Display ticket information
    document.getElementById("ticketBookingId").textContent =
        booking.bookingId;

    document.getElementById("ticketCustomerName").textContent =
        booking.buyerName;

    document.getElementById("ticketMovieName").textContent =
        booking.movie;

    document.getElementById("ticketShowDate").textContent =
        booking.showDate;

    document.getElementById("ticketShowTime").textContent =
        booking.showTime;

    document.getElementById("ticketSeatNumber").textContent =
        Array.isArray(booking.seats)
            ? booking.seats.join(", ")
            : booking.seats;

    document.getElementById("ticketPrice").textContent =
        "৳" + booking.totalPrice;

    // Generate QR Code
    const qrCodeArea = document.getElementById("qrCodeArea");

    qrCodeArea.innerHTML = "";

    const ticketData = JSON.stringify({
        bookingId: booking.bookingId,
        movie: booking.movie,
        showDate: booking.showDate,
        showTime: booking.showTime,
        seats: booking.seats
    });
    console.log("QR Code Data:", ticketData);
    function createQR() {
        qrCodeArea.innerHTML = "";

        new QRCode(qrCodeArea, {
            text: ticketData,
            width: 160,
            height: 160
        });
    }

    if (typeof QRCode !== "undefined") {
        createQR();
    } else {
        const script = document.createElement("script");

        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";

        script.onload = createQR;

        script.onerror = function () {
            qrCodeArea.textContent =
                "QR Code could not be loaded. Please check your internet connection.";
        };

        document.head.appendChild(script);
    }
}

// Load Digital Ticket
renderDigitalTicket();


// ===================================
// MY PROFILE - UPDATE PROFILE
// ===================================

(function () {

    const profileForm = document.getElementById("profileForm");

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhone = document.getElementById("profilePhone");

    const nameError = document.getElementById("profileNameError");
    const emailError = document.getElementById("profileEmailError");
    const phoneError = document.getElementById("profilePhoneError");

    // Load existing profile information
    function loadProfile() {

        const savedProfile = JSON.parse(
            localStorage.getItem("buyerProfile")
        );

        const bookings = JSON.parse(
            localStorage.getItem("movieBookings")
        ) || [];

        const latestBooking = [...bookings].reverse()[0];

        const profile = savedProfile || (latestBooking ? {
            name: latestBooking.buyerName,
            email: latestBooking.buyerEmail,
            phone: latestBooking.buyerPhone
        } : null);

        if (profile) {
            profileName.value = profile.name || "";
            profileEmail.value = profile.email || "";
            profilePhone.value = profile.phone || "";
        }

        updateWelcomeMessage();
    }

    // Update header welcome message
    function updateWelcomeMessage() {

        const buyerWelcome = document.getElementById("buyerWelcome");

        if (buyerWelcome && profileName.value.trim()) {
            buyerWelcome.textContent =
                "Welcome, " + profileName.value.trim();
        }
    }

    // Save updated profile
    profileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = profileName.value.trim();
        const email = profileEmail.value.trim();
        const phone = profilePhone.value.trim();

        // Clear previous error messages
        nameError.textContent = "";
        emailError.textContent = "";
        phoneError.textContent = "";

        // Validate name
        if (name.length < 2) {
            nameError.textContent =
                "Please enter your full name.";
            profileName.focus();
            return;
        }

        // Validate email
        if (!isValidEmail(email)) {
            emailError.textContent =
                "Please enter a valid email address.";
            profileEmail.focus();
            return;
        }

        // Validate phone number
        const phoneDigits = phone.replace(/\D/g, "");

        if (!/^\+?[0-9\s()-]{7,20}$/.test(phone) ||
            phoneDigits.length < 7 ||
            phoneDigits.length > 15) {

            phoneError.textContent =
                "Please enter a valid phone number.";

            profilePhone.focus();
            return;
        }

        // Create profile object
        const updatedProfile = {
            name: name,
            email: email,
            phone: phone
        };

        // Save profile in LocalStorage
        localStorage.setItem(
            "buyerProfile",
            JSON.stringify(updatedProfile)
        );

        // Update booking form information
        document.getElementById("name").value = name;
        document.getElementById("email").value = email;
        document.getElementById("phone").value = phone;

        // Update welcome message
        updateWelcomeMessage();

        alert("Profile updated successfully!");

    });

    // Load profile when page opens
    loadProfile();

})();

// Cancellation & Refund System

const cancellationForm = document.getElementById("cancellationForm");

cancellationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const bookingId = document.getElementById("bookingid").value.trim();
    const reason = document.getElementById("reason").value;
    const refundMethod = document.getElementById("refund").value;

    // Get existing bookings
    let bookings = JSON.parse(
        localStorage.getItem("movieBookings")
    ) || [];

    // Find booking
    const booking = bookings.find(function (item) {
        return item.bookingId.toLowerCase() === bookingId.toLowerCase();
    });

    // Check Booking ID
    if (!booking) {
        alert("Booking ID not found. Please enter a valid Booking ID.");
        return;
    }

    // Check booking status
    if (booking.status === "Cancelled") {
        alert("This booking has already been cancelled.");
        return;
    }

    // Save cancellation details
    booking.status = "Cancelled";
    booking.cancellationReason = reason;
    booking.refundMethod = refundMethod;
    booking.cancellationDate = new Date().toLocaleDateString();

    // Update LocalStorage
    localStorage.setItem(
        "movieBookings",
        JSON.stringify(bookings)
    );

    // Refresh booking tables
    renderBookings();
    renderBookingHistory();
    renderDigitalTicket();

    // Success message
    alert("Cancellation request submitted successfully!");

    cancellationForm.reset();
});
