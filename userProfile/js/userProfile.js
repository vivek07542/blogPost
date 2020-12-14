var myProfileDiv = document.getElementById("myProfileDiv");
// OnLoad Page function
window.addEventListener('load', function () {
    loadingStartAndStop();
    getAdminUserTableTab();
    editValueToProfile();
}, false);
// My Profile Click Event Function
function getAdminUserTableTab() {
    if (loggedInUser.role === "user") {
        let userForAdminTab = document.getElementById("userForAdminTab");
        userForAdminTab.style.display = "none";
    }
}
// Fetching Value Of Logged In User/Admin Form Local Storage As MyProfile Clicked
function editValueToProfile() {
    // document.getElementById("myProfileTab").click();
    objectDetailUser.forEach(function (user) {
        if (user.username === loggedInUser.username) {
            let profileUserValuePlacing = document.querySelectorAll(".UserInfoFromLocalStorage");
            profileUserValuePlacing[0].innerHTML = user.username;
            profileUserValuePlacing[1].innerHTML = user.password;
            profileUserValuePlacing[2].innerHTML = user.role;
            profileUserValuePlacing[3].innerHTML = user.firstname;
            profileUserValuePlacing[4].innerHTML = user.lastname;
            profileUserValuePlacing[5].innerHTML = user.phonenumber;
        }
    });
}
// Edit button Click Event On MyProfile
function editProfileBtn() {
    if (editProfileBtn.innerText === "Save") {
        let editedInputValue = document.querySelectorAll(".textinput");
        if (validation(editedInputValue)) {
            let profileUserValuePlacing = document.querySelectorAll(".UserInfoFromLocalStorage");
            let arrayValuePush = [];
            profileUserValuePlacing[0].innerText = profileUserValuePlacing[0].innerText;
            profileUserValuePlacing[1].innerText = editedInputValue[0].value;
            profileUserValuePlacing[2].innerText = profileUserValuePlacing[2].innerHTML;
            profileUserValuePlacing[3].innerText = editedInputValue[1].value;
            profileUserValuePlacing[4].innerText = editedInputValue[2].value;
            profileUserValuePlacing[5].innerText = editedInputValue[3].value;
            for (i = 0; i < profileUserValuePlacing.length; i++) {
                arrayValuePush.push(profileUserValuePlacing[i]);
            }
            // Value Assign To Local Storage 
            let editObject = {};
            editObject.username = arrayValuePush[0].innerText;
            editObject.password = arrayValuePush[1].innerText;
            editObject.role = arrayValuePush[2].innerText;
            editObject.firstname = arrayValuePush[3].innerText;
            editObject.lastname = arrayValuePush[4].innerText;
            editObject.phonenumber = arrayValuePush[5].innerText;
            localStorage.setItem("loggedInUser", JSON.stringify(editObject));
            let userArray = JSON.parse(localStorage.getItem("objectDetailUser"));
            userArray.forEach(function (e, index) {
                if (e.username === arrayValuePush[0].innerText) {
                    userArray.splice(index, 1);
                    localStorage.setItem('objectDetailUser', JSON.stringify(userArray));
                }
            });
            userArray.push(editObject);
            localStorage.setItem("objectDetailUser", JSON.stringify(userArray));
            editProfileBtn.innerText = "Edit";
        };
    }
    else {
        editProfileBtn.innerText = "Save";
        let profileUserValuePlacing = document.querySelectorAll(".UserInfoFromLocalStorage");
        let passwordValue = `<input class="form-control textinput" name="textinput" value="${profileUserValuePlacing[1].innerHTML}" />`;
        profileUserValuePlacing[0].innerHTML = profileUserValuePlacing[0].innerHTML;
        profileUserValuePlacing[1].innerHTML = passwordValue;
        profileUserValuePlacing[2].innerHTML = profileUserValuePlacing[2].innerHTML;
        for (i = 3; i < profileUserValuePlacing.length; i++) {
            let htmlInput = "" ;// let htmlInput = `<input class="form-control textinput" name="textinput" value="${profileUserValuePlacing[i].innerHTML}" />`;
           if(i === 5){
             htmlInput = `<input class="form-control textinput" name="textinput" type="number" value="${profileUserValuePlacing[i].innerHTML}" />`;  
           }
           else{
             htmlInput = `<input class="form-control textinput" name="textinput" value="${profileUserValuePlacing[i].innerHTML}" />`;
           }
            profileUserValuePlacing[i].innerHTML = htmlInput;
        }
    }
}
// User Click Function For Admin Only
function userForAdminTab() {
    let table = document.getElementById("tblData");
    let listitem1 = JSON.parse(localStorage.getItem("objectDetailUser"));
    let paginationElementForPost = document.getElementById("pagination3");
    var currentpage = 1;
    let rows = 5;
    let tableApproval = "To the Table";
    table.innerHTML = "";
    if (table.innerHTML === "") {
        displayList(listitem1, table, rows, currentpage, tableApproval);
        setupPagination(listitem1, paginationElementForPost, rows, currentpage, table, tableApproval);
    }
}
// Function For Pagination for Table
function tablePaginatedButton(paginatedItem, table, rowsperpage, condition) {
    let tableApproval = "To the Table";
    let currentpage = 1;
    let items = sortArrayBy(paginatedItem, "firstname", condition);
    displayList(items, table, rowsperpage, currentpage, tableApproval)
}
// Function to generate table on user click
function userTableGenerate(paginatedItem, rowsperpage) {
    let table = document.getElementById("tblData");
    let headers = [{ title: "UserName", isSort: false }, { title: "Password", isSort: false }, { title: "Admin", isSort: false }, { title: "First Name", isSort: true }, { title: "Last Name", isSort: false }, { title: "Mobile Number", isSort: false }, { title: "Edit", isSort: false }, { title: "Delete", isSort: false }]
    let tableHead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    headers.forEach(headerText => {
        let header = document.createElement("th");
        header.setAttribute("scope", "col");
        let title = document.createElement("span");
        title.innerText = headerText.title;
        header.appendChild(title);
        if (headerText.isSort === true) {
            let headerSortButton = createTableElements(header, "button", "headerSortButton", null, null, null, null);
            let desc = false;
            headerSortButton.addEventListener("click", function () {
                tablePaginatedButton(paginatedItem, table, rowsperpage, desc)
            });
            let buttonSymbol = createTableElements(headerSortButton, "i", "fa fa-sort-alpha-asc", "true", null, null, null);
            // 2 Decending Button
            let headerButtonPaginatation = createTableElements(header, "button", "headerSortButton", null, null, null, null);
            let desc1 = true;
            headerButtonPaginatation.addEventListener("click", function () {
                tablePaginatedButton(paginatedItem, table, rowsperpage, desc1)
            });
            let buttonSymbol1 = createTableElements(headerButtonPaginatation, "i", "fa fa-sort-alpha-desc", "true", null, null, null);
            header.appendChild(headerSortButton);
            header.appendChild(headerButtonPaginatation);
        }
        headerRow.appendChild(header);
        tableHead.appendChild(headerRow);
    });
    table.appendChild(tableHead);
    let tableBody = document.createElement("tbody");
    paginatedItem.forEach(per => {
        let row = createTableElements(tableBody, "tr", "tableEachRow", null, null, null, null);
        row.setAttribute("scope", "row")
        Object.values(per).forEach(text => {
            let cell = createTableElements(row, "td", "tableEachCell", null, null, null, null);
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
        })
        let editCell = document.createElement("td");
        let editButton = createTableElements(editCell, "button", "btn btn-primary", null, "userEditBtn", "Edit", null);
        // editButton.innerHTML = "Edit";
        editButton.addEventListener("click", function () {
            editClick(editButton);
        });
        let deleteCell = document.createElement("td");
        let deleteButton = createTableElements(deleteCell, "button", "btn btn-primary", null, "userDeleteBtn", "Delete", null);
        // deleteButton.innerHTML = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteUser(deleteButton);
        });
        row.appendChild(editCell);
        row.appendChild(deleteCell);
        table.appendChild(tableBody);
    })
}
// Delete User Click Event
function deleteUser(deleteButton) {
    if (confirm("Do you want to Delete this User?")) {
        let parentTr = deleteButton.parentNode.parentNode;
        parentTr.parentNode.removeChild(parentTr);
        let userNameToDelete = parentTr.children[0];
        objectDetailUser.forEach(function (e, index) {
            if (e.username === userNameToDelete.innerText) {
                objectDetailUser.splice(index, 1);
                localStorage.setItem('objectDetailUser', JSON.stringify(objectDetailUser));
            }
        });
    }
}
// Create user Click Event
function createNewUserBtn() {
    markContainer.style.display = "flex";
    myProfileDiv.style.display = "block";
}
// Function for Edit
function editClick(editButton) {
    markContainer.style.display = "flex";
    myProfileDiv.style.display = "block";
    let newUserInputValue = document.querySelectorAll(".createUserInputData");
    let parentTr = editButton.parentNode.parentNode;
    let parentChildren = parentTr.querySelectorAll(".tableEachCell");
    for (i = 0; i < parentChildren.length; i++) {
        for (j = 0; j < newUserInputValue.length; j++) {
            if (i === j) {
                newUserInputValue[j].value = parentChildren[i].innerText;
            }
        }
    }
}
function createdUserDetailSubmitBtn() {
    let newUserInputValue = document.querySelectorAll(".createUserInputData");
    if (validation(newUserInputValue)) {
        createUser(newUserInputValue);
        resetValue(newUserInputValue);
        userForAdminTab();
    };
}
// Create User Function
function createUser(newUserInputValue) {
    let objectCreate = {};
    objectCreate.username = newUserInputValue[0].value;
    objectCreate.password = newUserInputValue[1].value;
    objectCreate.role = newUserInputValue[2].value;
    objectCreate.firstname = newUserInputValue[3].value;
    objectCreate.lastname = newUserInputValue[4].value;
    objectCreate.phonenumber = newUserInputValue[5].value;
    let userArray = JSON.parse(localStorage.getItem("objectDetailUser"));
    userArray.forEach(function (e, index) {
        if (e.username === objectCreate.username) {
            userArray.splice(index, 1);
            localStorage.setItem('objectDetailUser', JSON.stringify(userArray));
        }
    });
    userArray.push(objectCreate);
    localStorage.setItem("objectDetailUser", JSON.stringify(userArray));
}
// Validation for Create User
function validation(element){
    let trueArray = [];
    let isAllValidationPassed = true;
    element.forEach(function (e, index){
        genericTextboxValidator(e,index, trueArray);
    });
    for (let i = 0; i < objectDetailUser.length; i++) {
        if (element[0].value === objectDetailUser[i].username) {
            document.getElementById("textIfFailForPopupCreate").style.display = "block";
            isAllValidationPassed = false;
            break;
        }
        else {
            document.getElementById("textIfFailForPopupCreate").style.display = "none";
        }
        trueArray.push(isAllValidationPassed);
    }
    isAllValidationPassed = trueArray.every(checkBoolean);
    return isAllValidationPassed;
}
function checkBoolean(elem) {
    return elem === true;    
}
function genericTextboxValidator(input,index, trueArray) {
    debugger;
    let isValid = true;
    if (input.value.trim() === "") {
        input.classList.add("validateRedBorder")
        input.classList.remove("validateGreenBorder")
        isValid = false;
    }
    else if (input.type === "number") {
        if (input.value.length !== 10) {
          input.classList.remove('validateGreenBorder');
          input.classList.add("validateRedBorder");
          isValid = false;
        }
        else {
            input.classList.remove("validateRedBorder");
            input.classList.add('validateGreenBorder');
        }
    }
    else {
        input.classList.add("validateGreenBorder")
        input.classList.remove("validateRedBorder")
    }
    trueArray.push(isValid);
    return trueArray;
}
// reset Function for Create User
function resetValue(newUserInputValue) {
    for (i = 0; i < newUserInputValue.length; i++) {
        newUserInputValue[i].value = "";
        newUserInputValue[i].classList.remove("validateGreenBorder");
        document.getElementById("textIfFailForPopupCreate").style.display = "none";
    }
    markContainer.style.display = "none";
    myProfileDiv.style.display = "none";
}
// PopUp Close Button Click event
closeDynamic.addEventListener("click", function () {
    markContainer.style.display = "none";
    let newUserInputValue = document.querySelectorAll(".createUserInputData");
    resetValue(newUserInputValue);
});