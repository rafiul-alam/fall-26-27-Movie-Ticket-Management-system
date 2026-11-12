
// Shared Helper and Validation Functions

// Validate Email Address
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Validate Phone Number
function isValidPhone(phone) {
    const phoneDigits = phone.replace(/\D/g, "");

    return (
        /^\+?[0-9\s()-]{7,20}$/.test(phone) &&
        phoneDigits.length >= 7 &&
        phoneDigits.length <= 15
    );
}
