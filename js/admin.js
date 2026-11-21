var users = JSON.parse(localStorage.getItem("mtmsUsers")) || [];
var theaters = JSON.parse(localStorage.getItem("mtmsTheaters")) || [
    { name: "City Cinema", location: "Dhaka", screens: 4 },
    { name: "Star Cineplex", location: "Dhaka", screens: 6 }
];

function showUsers(list) {
    var table = document.getElementById("userTable");
    table.innerHTML = "";
    for (var i = 0; i < list.length; i++) {
        table.innerHTML += "<tr><td>" + list[i].name + "</td><td>" + list[i].email + "</td><td>" + list[i].role + "</td><td><button class='small-button' onclick='editUser(" + i + ")'>Edit</button> <button class='small-button delete-button' onclick='deleteUser(" + i + ")'>Delete</button></td></tr>";
    }
    document.getElementById("totalUsers").textContent = list.length;
}

function showTheaters(list) {
    var table = document.getElementById("theaterTable");
    table.innerHTML = "";
    for (var i = 0; i < list.length; i++) {
        table.innerHTML += "<tr><td>" + list[i].name + "</td><td>" + list[i].location + "</td><td>" + list[i].screens + "</td><td><button class='small-button' onclick='editTheater(" + i + ")'>Edit</button> <button class='small-button delete-button' onclick='deleteTheater(" + i + ")'>Delete</button></td></tr>";
    }
    document.getElementById("totalTheaters").textContent = list.length;
}

function editUser(index) {
    var newName = prompt("Enter new name", users[index].name);
    var newEmail = prompt("Enter new email", users[index].email);
    if (newName != null && newEmail != null && newName != "" && newEmail != "") {
        users[index].name = newName;
        users[index].email = newEmail;
        localStorage.setItem("mtmsUsers", JSON.stringify(users));
        showUsers(users);
    }
}

function deleteUser(index) {
    users.splice(index, 1);
    localStorage.setItem("mtmsUsers", JSON.stringify(users));
    showUsers(users);
}

function editTheater(index) {
    var newName = prompt("Enter theater name", theaters[index].name);
    var newLocation = prompt("Enter location", theaters[index].location);
    var newScreens = prompt("Enter number of screens", theaters[index].screens);
    if (newName != null && newLocation != null && newScreens != null && newName != "" && newLocation != "" && newScreens != "") {
        theaters[index] = { name: newName, location: newLocation, screens: newScreens };
        localStorage.setItem("mtmsTheaters", JSON.stringify(theaters));
        showTheaters(theaters);
    }
}

function deleteTheater(index) {
    theaters.splice(index, 1);
    localStorage.setItem("mtmsTheaters", JSON.stringify(theaters));
    showTheaters(theaters);
}

document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var name = document.getElementById("userName").value;
    var email = document.getElementById("userEmail").value;
    var role = document.getElementById("userRole").value;
    if (name == "" || email == "") {
        alert("Please enter the user name and email.");
        return;
    }
    users.push({ name: name, email: email, role: role });
    localStorage.setItem("mtmsUsers", JSON.stringify(users));
    showUsers(users);
    this.reset();
});

document.getElementById("theaterForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var name = document.getElementById("theaterName").value;
    var location = document.getElementById("theaterLocation").value;
    var screens = document.getElementById("theaterScreens").value;
    if (name == "" || location == "" || screens == "") {
        alert("Please fill in all theater fields.");
        return;
    }
    theaters.push({ name: name, location: location, screens: screens });
    localStorage.setItem("mtmsTheaters", JSON.stringify(theaters));
    showTheaters(theaters);
    this.reset();
});

document.getElementById("userSearch").addEventListener("input", function() {
    var searchText = this.value.toLowerCase();
    var result = users.filter(function(user) {
        return user.name.toLowerCase().includes(searchText) || user.email.toLowerCase().includes(searchText);
    });
    showUsers(result);
});

document.getElementById("theaterSearch").addEventListener("input", function() {
    var searchText = this.value.toLowerCase();
    var result = theaters.filter(function(theater) {
        return theater.name.toLowerCase().includes(searchText) || theater.location.toLowerCase().includes(searchText);
    });
    showTheaters(result);
});

document.getElementById("totalBookings").textContent = (JSON.parse(localStorage.getItem("mtmsBookings")) || []).length;
showUsers(users);
showTheaters(theaters);
