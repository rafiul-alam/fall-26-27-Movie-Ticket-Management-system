
var search = document.getElementById("search");
var status = document.getElementById("status");
var userTable = document.querySelectorAll("table")[0];

function searchUser() {
    var rows = userTable.getElementsByTagName("tr");

    for (var i = 1; i < rows.length; i++) {
        var name = rows[i].cells[1].innerText.toLowerCase();
        var email = rows[i].cells[2].innerText.toLowerCase();
        var userStatus = rows[i].cells[3].innerText.toLowerCase();

        if ((name.includes(search.value.toLowerCase()) || email.includes(search.value.toLowerCase())) && (status.value == "all" || userStatus == status.value)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

search.addEventListener("input", searchUser);
status.addEventListener("change", searchUser);

userTable.addEventListener("click", function(event) {
    var button = event.target;

    if (button.tagName == "BUTTON") {
        var row = button.parentElement.parentElement;
        var action = button.innerText;

        if (action == "Approve") {
            row.cells[3].innerText = "Active";
            row.cells[4].innerHTML = "<button>Suspend</button>";
            alert("User Approved!");
        } 
        else if (action == "Reject") {
            row.remove();
            alert("User Rejected!");
        } 
        else if (action == "Suspend") {
            row.cells[3].innerText = "Suspended";
            row.cells[4].innerHTML = "<button>Reactivate</button>";
            alert("User Suspended!");
        } 
        else if (action == "Reactivate") {
            row.cells[3].innerText = "Active";
            row.cells[4].innerHTML = "<button>Suspend</button>";
            alert("User Reactivated!");
        }
    }
});

var period = document.getElementById("period");
var analyticsForm = document.querySelectorAll("form")[1];
var revenueTable = document.querySelectorAll("table")[1];

analyticsForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (period.value == "7") {
        revenueTable.rows[1].cells[0].innerText = "Tk. 1,20,000";
        revenueTable.rows[1].cells[1].innerText = "3,200";
        revenueTable.rows[1].cells[2].innerText = "350";
    } 
    else if (period.value == "30") {
        revenueTable.rows[1].cells[0].innerText = "Tk. 4,82,000";
        revenueTable.rows[1].cells[1].innerText = "12,480";
        revenueTable.rows[1].cells[2].innerText = "1,283";
    } 
    else if (period.value == "90") {
        revenueTable.rows[1].cells[0].innerText = "Tk. 12,50,000";
        revenueTable.rows[1].cells[1].innerText = "35,600";
        revenueTable.rows[1].cells[2].innerText = "3,500";
    }

    alert("Analytics Updated!");
});

var theatreForm = document.querySelectorAll("form")[2];
var theatreName = document.getElementById("theatre_name");
var city = document.getElementById("city");
var theatreSelect = document.getElementById("theatre");

theatreForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (theatreName.value == "" || city.value == "") {
        alert("Please enter theatre name and city!");
    } 
    else {
        var option = document.createElement("option");

        option.text = theatreName.value + ", " + city.value;
        option.value = theatreSelect.options.length + 1;

        theatreSelect.add(option);

        alert("Theatre Added Successfully!");
        theatreForm.reset();
    }
});

var screenForm = document.querySelectorAll("form")[3];
var screenTable = document.querySelectorAll("table")[3];

screenForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var screenName = document.getElementById("screen_name").value;
    var rows = document.getElementById("rows").value;
    var seats = document.getElementById("seats").value;
    var screenType = document.querySelector('input[name="screen_type"]:checked');

    if (screenName == "" || rows == "" || seats == "" || !screenType) {
        alert("Please fill all the information!");
    } 
    else {
        var totalSeats = rows * seats;
        var theatre = theatreSelect.options[theatreSelect.selectedIndex].text;

        var newRow = screenTable.insertRow();

        newRow.insertCell(0).innerText = theatre;
        newRow.insertCell(1).innerText = screenName;
        newRow.insertCell(2).innerText = screenType.value;
        newRow.insertCell(3).innerText = totalSeats;
        newRow.insertCell(4).innerHTML = '<button>Edit</button> <button>Remove</button>';

        alert("Screen Added Successfully!");
        screenForm.reset();
    }
});

screenTable.addEventListener("click", function(event) {
    var button = event.target;

    if (button.tagName == "BUTTON") {
        var row = button.parentElement.parentElement;

        if (button.innerText == "Remove") {
            row.remove();
            alert("Screen Removed!");
        } 
        else if (button.innerText == "Edit") {
            var newName = prompt("Enter new screen name:");

            if (newName != null && newName != "") {
                row.cells[1].innerText = newName;
                alert("Screen Updated!");
            }
        }
    }
});
