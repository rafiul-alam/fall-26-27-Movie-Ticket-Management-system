// Default data
let initialTickets = [
    { ticketId: "TCK-101", customerName: "Rahim Uddin", movieTitle: "Avatar: Fire & Ash", hall: "Hall-01", showTime: "11:30 AM", seatNumber: "A-12", status: "Booked", checkInTime: "-" },
    { ticketId: "TCK-102", customerName: "Karim Chowdhury", movieTitle: "Avatar: Fire & Ash", hall: "Hall-01", showTime: "11:30 AM", seatNumber: "A-13", status: "Checked-in", checkInTime: "11:15 AM" },
    { ticketId: "TCK-103", customerName: "Nusrat Jahan", movieTitle: "Oppenheimer Special", hall: "Hall-02", showTime: "03:00 PM", seatNumber: "C-05", status: "Booked", checkInTime: "-" },
    { ticketId: "TCK-104", customerName: "Tanvir Ahmed", movieTitle: "Dune: Part Two", hall: "Hall-03", showTime: "06:45 PM", seatNumber: "B-08", status: "Booked", checkInTime: "-" },
    { ticketId: "TCK-105", customerName: "Sadia Islam", movieTitle: "Avatar: Fire & Ash", hall: "Hall-01", showTime: "11:30 AM", seatNumber: "A-14", status: "Booked", checkInTime: "-" }
];

let initialSupportIssues = [
    { issueId: "SUP-1001", customerName: "Rahim Uddin", bookingId: "TCK-101", category: "Seat Duplicate / Mix-up", priority: "High", details: "Another customer has duplicate ticket for A-12.", status: "Open" },
    { issueId: "SUP-1002", customerName: "Farhan Ali", bookingId: "TCK-088", category: "Payment / Refund Request", priority: "Medium", details: "Double charged on bKash during payment.", status: "Resolved" }
];

let screenSchedules = [
    { movieTitle: "Avatar: Fire & Ash", hall: "Hall-01", showTime: "11:30 AM", capacity: 60 },
    { movieTitle: "Oppenheimer Special", hall: "Hall-02", showTime: "03:00 PM", capacity: 45 },
    { movieTitle: "Dune: Part Two", hall: "Hall-03", showTime: "06:45 PM", capacity: 50 }
];

// Initialize localStorage
function initLocalStorage() {
    if (!localStorage.getItem("movieTickets")) {
        let existing = localStorage.getItem("cinemaTickets");
        localStorage.setItem("movieTickets", existing ? existing : JSON.stringify(initialTickets));
    }
    if (!localStorage.getItem("movieSupportIssues")) {
        let existing = localStorage.getItem("cinemaSupportIssues");
        localStorage.setItem("movieSupportIssues", existing ? existing : JSON.stringify(initialSupportIssues));
    }
}

// Gate ticket verification
function handleCheckIn(event) {
    event.preventDefault();

    let inputElement = document.getElementById("ticketCodeInput");
    let errorSpan = document.getElementById("ticketError");
    let resultBox = document.getElementById("verificationResult");

    errorSpan.innerHTML = "";
    resultBox.style.display = "none";
    resultBox.className = "alert-box";

    let ticketCode = inputElement.value.trim().toUpperCase();

    // Check empty input
    if (ticketCode === "") {
        errorSpan.innerHTML = "Please enter or scan a ticket code.";
        errorSpan.style.color = "red";
        return false;
    }

    let tickets = JSON.parse(localStorage.getItem("movieTickets")) || [];
    let foundIndex = -1;

    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].ticketId.toUpperCase() === ticketCode) {
            foundIndex = i;
            break;
        }
    }

    // Invalid ticket
    if (foundIndex === -1) {
        resultBox.style.display = "block";
        resultBox.className = "alert-box alert-error";
        resultBox.innerHTML = "<strong>Access Denied:</strong> Ticket (" + ticketCode + ") not found in system.";
        return false;
    }

    let ticket = tickets[foundIndex];

    // Already checked in
    if (ticket.status === "Checked-in") {
        resultBox.style.display = "block";
        resultBox.className = "alert-box alert-warning";
        resultBox.innerHTML = "<strong>Duplicate Entry:</strong> Ticket " + ticket.ticketId + " (" + ticket.customerName + ") was already checked in at " + ticket.checkInTime + ".";
        return false;
    }

    // Update status to Checked-in
    let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ticket.status = "Checked-in";
    ticket.checkInTime = currentTime;

    tickets[foundIndex] = ticket;
    localStorage.setItem("movieTickets", JSON.stringify(tickets));

    resultBox.style.display = "block";
    resultBox.className = "alert-box alert-success";
    resultBox.innerHTML = "<strong>Verified:</strong> Welcome " + ticket.customerName + "! Ticket " + ticket.ticketId + " checked in at " + currentTime + " (Seat: " + ticket.seatNumber + ", " + ticket.hall + ").";

    inputElement.value = "";

    renderTicketsTable();
    calculateReports();
    return true;
}

// Display tickets table
function renderTicketsTable(filteredList) {
    let tickets = filteredList || JSON.parse(localStorage.getItem("movieTickets")) || [];
    let tableBody = document.getElementById("ticketsTableBody");
    let tableHtml = "";

    if (tickets.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='8' style='text-align:center;'>No tickets found.</td></tr>";
        return;
    }

    for (let i = 0; i < tickets.length; i++) {
        let t = tickets[i];
        let badgeClass = (t.status === "Checked-in") ? "badge badge-checkedin" : "badge badge-booked";

        tableHtml += "<tr>";
        tableHtml += "<td><strong>" + t.ticketId + "</strong></td>";
        tableHtml += "<td>" + t.customerName + "</td>";
        tableHtml += "<td>" + t.movieTitle + "</td>";
        tableHtml += "<td>" + t.hall + "</td>";
        tableHtml += "<td>" + t.showTime + "</td>";
        tableHtml += "<td>" + t.seatNumber + "</td>";
        tableHtml += "<td><span class='" + badgeClass + "'>" + t.status + "</span></td>";
        tableHtml += "<td>" + t.checkInTime + "</td>";
        tableHtml += "</tr>";
    }

    tableBody.innerHTML = tableHtml;
}

// Search tickets
function searchTickets() {
    let query = document.getElementById("ticketSearchBar").value.toLowerCase().trim();
    let tickets = JSON.parse(localStorage.getItem("movieTickets")) || [];

    if (query === "") {
        renderTicketsTable(tickets);
        return;
    }

    let matching = [];
    for (let i = 0; i < tickets.length; i++) {
        let idMatch = tickets[i].ticketId.toLowerCase().indexOf(query) !== -1;
        let nameMatch = tickets[i].customerName.toLowerCase().indexOf(query) !== -1;
        let movieMatch = tickets[i].movieTitle.toLowerCase().indexOf(query) !== -1;
        let hallMatch = tickets[i].hall.toLowerCase().indexOf(query) !== -1;

        if (idMatch || nameMatch || movieMatch || hallMatch) {
            matching.push(tickets[i]);
        }
    }

    renderTicketsTable(matching);
}

// Validate support form and add issue
function validateSupportForm(event) {
    event.preventDefault();

    let custName = document.getElementById("custName").value.trim();
    let bookingId = document.getElementById("bookingId").value.trim();
    let issueCategory = document.getElementById("issueCategory").value;
    let issueDetails = document.getElementById("issueDetails").value.trim();

    let priorityRadios = document.getElementsByName("priorityLevel");
    let selectedPriority = "Medium";
    for (let i = 0; i < priorityRadios.length; i++) {
        if (priorityRadios[i].checked) {
            selectedPriority = priorityRadios[i].value;
            break;
        }
    }

    document.getElementById("nameError").innerHTML = "";
    document.getElementById("bookingError").innerHTML = "";
    document.getElementById("categoryError").innerHTML = "";
    document.getElementById("detailsError").innerHTML = "";

    let isValid = true;

    if (custName === "") {
        document.getElementById("nameError").innerHTML = "Customer name is required.";
        document.getElementById("nameError").style.color = "red";
        isValid = false;
    }

    if (bookingId === "") {
        document.getElementById("bookingError").innerHTML = "Booking ID is required.";
        document.getElementById("bookingError").style.color = "red";
        isValid = false;
    }

    if (issueCategory === "") {
        document.getElementById("categoryError").innerHTML = "Please select a category.";
        document.getElementById("categoryError").style.color = "red";
        isValid = false;
    }

    if (issueDetails === "") {
        document.getElementById("detailsError").innerHTML = "Please enter issue details.";
        document.getElementById("detailsError").style.color = "red";
        isValid = false;
    }

    if (!isValid) {
        return false;
    }

    let newIssue = {
        issueId: "SUP-" + Math.floor(1000 + Math.random() * 9000),
        customerName: custName,
        bookingId: bookingId.toUpperCase(),
        category: issueCategory,
        priority: selectedPriority,
        details: issueDetails,
        status: "Open"
    };

    let issues = JSON.parse(localStorage.getItem("movieSupportIssues")) || [];
    issues.push(newIssue);
    localStorage.setItem("movieSupportIssues", JSON.stringify(issues));

    document.getElementById("supportForm").reset();
    renderSupportTable();
    alert("Support Issue #" + newIssue.issueId + " added successfully.");
    return true;
}

// Display support table
function renderSupportTable(filteredList) {
    let issues = filteredList || JSON.parse(localStorage.getItem("movieSupportIssues")) || [];
    let tableBody = document.getElementById("supportTableBody");
    let tableHtml = "";

    if (issues.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='8' style='text-align:center;'>No issues found.</td></tr>";
        return;
    }

    for (let i = 0; i < issues.length; i++) {
        let issue = issues[i];
        let statusBadge = (issue.status === "Resolved") ? "badge badge-resolved" : "badge badge-open";

        tableHtml += "<tr>";
        tableHtml += "<td><strong>" + issue.issueId + "</strong></td>";
        tableHtml += "<td>" + issue.customerName + "</td>";
        tableHtml += "<td>" + issue.bookingId + "</td>";
        tableHtml += "<td>" + issue.category + "</td>";
        tableHtml += "<td>" + issue.priority + "</td>";
        tableHtml += "<td>" + issue.details + "</td>";
        tableHtml += "<td><span class='" + statusBadge + "'>" + issue.status + "</span></td>";
        tableHtml += "<td>";
        tableHtml += "<button type='button' class='btn btn-status' onclick='toggleIssueStatus(\"" + issue.issueId + "\")'>Status</button>";
        tableHtml += "<button type='button' class='btn btn-danger' onclick='deleteSupportIssue(\"" + issue.issueId + "\")'>Delete</button>";
        tableHtml += "</td>";
        tableHtml += "</tr>";
    }

    tableBody.innerHTML = tableHtml;
}

// Toggle issue status
function toggleIssueStatus(issueId) {
    let issues = JSON.parse(localStorage.getItem("movieSupportIssues")) || [];

    for (let i = 0; i < issues.length; i++) {
        if (issues[i].issueId === issueId) {
            issues[i].status = (issues[i].status === "Open") ? "Resolved" : "Open";
            break;
        }
    }

    localStorage.setItem("movieSupportIssues", JSON.stringify(issues));
    renderSupportTable();
}

// Delete support issue
function deleteSupportIssue(issueId) {
    let confirmDelete = confirm("Are you sure you want to delete issue " + issueId + "?");
    if (!confirmDelete) {
        return;
    }

    let issues = JSON.parse(localStorage.getItem("movieSupportIssues")) || [];
    let updatedIssues = [];

    for (let i = 0; i < issues.length; i++) {
        if (issues[i].issueId !== issueId) {
            updatedIssues.push(issues[i]);
        }
    }

    localStorage.setItem("movieSupportIssues", JSON.stringify(updatedIssues));
    renderSupportTable();
}

// Filter support issues
function searchSupportIssues() {
    let query = document.getElementById("searchBar").value.toLowerCase().trim();
    let issues = JSON.parse(localStorage.getItem("movieSupportIssues")) || [];

    if (query === "") {
        renderSupportTable(issues);
        return;
    }

    let matchingIssues = [];
    for (let i = 0; i < issues.length; i++) {
        let nameMatch = issues[i].customerName.toLowerCase().indexOf(query) !== -1;
        let idMatch = issues[i].bookingId.toLowerCase().indexOf(query) !== -1;
        let categoryMatch = issues[i].category.toLowerCase().indexOf(query) !== -1;

        if (nameMatch || idMatch || categoryMatch) {
            matchingIssues.push(issues[i]);
        }
    }

    renderSupportTable(matchingIssues);
}

// Calculate screening reports
function calculateReports() {
    let tickets = JSON.parse(localStorage.getItem("movieTickets")) || [];

    let totalCapacity = 0;
    for (let i = 0; i < screenSchedules.length; i++) {
        totalCapacity += screenSchedules[i].capacity;
    }

    let totalCheckedIn = 0;
    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].status === "Checked-in") {
            totalCheckedIn++;
        }
    }

    let overallOccupancy = 0;
    if (totalCapacity > 0) {
        overallOccupancy = Math.round((totalCheckedIn / totalCapacity) * 100);
    }

    document.getElementById("metricCapacity").innerHTML = totalCapacity;
    document.getElementById("metricCheckedIn").innerHTML = totalCheckedIn;
    document.getElementById("metricOccupancy").innerHTML = overallOccupancy + "%";

    let reportBody = document.getElementById("reportTableBody");
    let reportHtml = "";

    for (let i = 0; i < screenSchedules.length; i++) {
        let schedule = screenSchedules[i];
        let bookedCount = 0;
        let checkedInCount = 0;

        for (let j = 0; j < tickets.length; j++) {
            if (tickets[j].movieTitle === schedule.movieTitle && tickets[j].hall === schedule.hall) {
                bookedCount++;
                if (tickets[j].status === "Checked-in") {
                    checkedInCount++;
                }
            }
        }

        let hallOccupancy = Math.round((checkedInCount / schedule.capacity) * 100);

        reportHtml += "<tr>";
        reportHtml += "<td><strong>" + schedule.movieTitle + "</strong></td>";
        reportHtml += "<td>" + schedule.hall + "</td>";
        reportHtml += "<td>" + schedule.showTime + "</td>";
        reportHtml += "<td>" + schedule.capacity + " seats</td>";
        reportHtml += "<td>" + bookedCount + "</td>";
        reportHtml += "<td>" + checkedInCount + "</td>";
        reportHtml += "<td><strong>" + hallOccupancy + "%</strong></td>";
        reportHtml += "</tr>";
    }

    reportBody.innerHTML = reportHtml;
}

// Page load
window.onload = function() {
    initLocalStorage();
    renderTicketsTable();
    renderSupportTable();
    calculateReports();
};
