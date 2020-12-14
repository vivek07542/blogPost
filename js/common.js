let userFullName = document.getElementById("userFullName");
var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
var objectDetailUser = JSON.parse(localStorage.getItem("objectDetailUser"));

userFullName.innerText = loggedInUser.firstname + " " + loggedInUser.lastname;
// SignOut ClickEvent
let dropdownUserSignOut = document.getElementById("dropdownUserSignOut");
dropdownUserSignOut.addEventListener("click", function () {
    if (confirm("Do you want to Signout?")) {
        document.location.href = "index.html";
    }
});
// Function For Profile Click Button on Nav Bar
function dropdownProfile() {
    setTimeout(function () { document.location.href = "userProfile.html"; }, 3000);
}
// Click Post on Navbar Click Event
function clickPostEvent() {
    setTimeout(function () { document.location.href = "posts.html"; }, 3000);
}
// Sort Function for Post Date Vise...
function sortArrayBy(array, sort, desc) {
    array.sort(function (a, b) {
        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
    });
    if (desc) array.reverse();
    return array;
}
// Conditions to use selected post and recreate the post as per Pending Post,All Post & Promotional Post

function allPostClick(div, approval) {
    debugger;
    let postArray = JSON.parse(localStorage.getItem("userPosts"));
    pendingPostArray = [];
    approvedPost = [];
    adminPost = [];
    // let arrayForPage=[];  
    if (postArray !== null) {
        postArray.forEach(e => {
            debugger;
            if (e.username === loggedInUser.username || loggedInUser.role === "admin") {
                // Condition For Pending Post
                if (approval === false) {
                    if (e.approved === false) {
                        pendingPostArray.push(e);
                        localStorage.setItem("postForPending", JSON.stringify(pendingPostArray));
                    }
                }
                // Condition For all post
                if (approval === true && approval !== "showToAdmin") {
                    debugger;
                    for (i = 0; i < objectDetailUser.length; i++) {
                        if (e.approved === true && objectDetailUser[i].username === e.username && objectDetailUser[i].role !== "admin") {
                            approvedPost.push(e);
                            localStorage.setItem("postForallPost", JSON.stringify(approvedPost));
                        }
                    }
                }
                // Condition For Promotional Post
                if (approval === "showToAdmin") {
                    for (i = 0; i < objectDetailUser.length; i++) {
                        if (e.approved === true && objectDetailUser[i].username === e.username && objectDetailUser[i].role === "admin") {
                            adminPost.push(e);
                            localStorage.setItem("postByAdmin", JSON.stringify(adminPost));
                        }
                    }
                }
            }
            else if (e.sharePost !== "") {
                for (i = 0; i < e.sharePost.length; i++) {
                    if (e.sharePost[i] === loggedInUser.username) {
                        for (j = 0; j < objectDetailUser.length; j++) {
                            if (objectDetailUser[j].username === e.sharePost[i] && approval === true && e.approved === true) {
                                approvedPost.push(e);
                                localStorage.setItem("postForallPost", JSON.stringify(approvedPost));
                            }
                        }
                        break;
                    }
                }
            }
        });
    }
}
// Pagination
// Div ceate as per page size and extract detail 
function displayList(items, wrapper, rowsperpage, currentpage, approval) {
    debugger;
    var paginatedItem = arrayForDisplay(items, wrapper, rowsperpage, currentpage, approval);

    if (approval === "To the Table") {
        userTableGenerate(paginatedItem, rowsperpage);
    }
    else {
        if (paginatedItem !== null && paginatedItem !== undefined) {
            debugger;
            let sortButton = document.querySelectorAll(".sorting");
            let desc = false;
            for (i = 0; i < sortButton.length; i++) {
                sortButton[i].addEventListener("click", function () {
                    wrapper.innerText = "";
                    debugger;
                    let paginatedItem1 = sortArrayBy(paginatedItem, "date", desc);
                    paginatedItem1.forEach(e => {
                        postCreated(wrapper, e, approval);
                    });
                    desc = !desc;
                });
            }
            paginatedItem.forEach(e => {
                postCreated(wrapper, e, approval);
            });
        }
    }
}
function arrayForDisplay(items, wrapper, rowsperpage, currentpage, approval) {
    debugger;
    wrapper.innerHTML = "";
    currentpage--;
    let start = rowsperpage * currentpage;
    let end = start + rowsperpage;
    if (items !== null) {
        var paginatedItem = items.slice(start, end);
        return paginatedItem;
    }
}
// Function To Create Something
function createTableElements(parentName, formType, className, aria, idName, childInnerText, disabled) {
    let childrenName = document.createElement(formType);
    if (className !== null) {
        childrenName.setAttribute("class", className);
    }
    if (idName !== null) {
        childrenName.setAttribute("id", idName);
    }
    if (aria !== null) {
        childrenName.setAttribute("aria-hidden", aria);
    }
    if (childInnerText !== null) {
        childrenName.innerText = childInnerText;
    }
    if (disabled !== null) {
        childrenName.disabled = true;
    }
    parentName.appendChild(childrenName);
    return childrenName;
}
// To Create Post Dynamically For Pending Post,All Post & Promotional Post
function postCreated(div, e, approval) {
    let postDiv = createTableElements(div, "div", "postDiv", null, null, null, null);
    let localStoragePost = createTableElements(postDiv, "div", "localStoragePost", null, null, null, null);
    let postFromLocalByUsers = createTableElements(localStoragePost, "p", "postText", null, null, null, null);
    let seeMoreBtn = createTableElements(localStoragePost, "a", "seeMoreBtn", null, null, "Read More", null);
    let str = e.post;
    postFromLocalByUsers.textContent = str.substring(0, 100) + ".....";
    readMore(seeMoreBtn, postFromLocalByUsers, str);
    let userPostDetail = createTableElements(postDiv, "div", "userPostDetail", null, null, null, null);
    if (approval === false && loggedInUser.role === "admin") {
        let adminApprovalCheckBox = createTableElements(userPostDetail, "input", "adminApprovalCheckBox", null, null, null, null);
        adminApprovalCheckBox.setAttribute("type", "checkbox");
        adminApprovalCheckBox.addEventListener("click", function () {
            chkBoxSelect(adminApprovalCheckBox);
        });
    };
    let postByUserName = createTableElements(userPostDetail, "span", null, null, null, null);
    postByUserName.innerText = e.username;
    let postDate = createTableElements(userPostDetail, "span", null, null, null, null);
    postDate.innerText = e.date;
}
// Read More function for Paragraph tag or for the post to show Read More/Read Less on Click Event
function readMore(seeMoreBtn, postFromLocalByUsers, str) {
    seeMoreBtn.addEventListener("click", function () {
        if (seeMoreBtn.innerHTML == "Read More") {
            postFromLocalByUsers.textContent = str;
            seeMoreBtn.textContent = "Read Less";
        }
        else {
            postFromLocalByUsers.textContent = str.substring(0, 200) + ".....";
            seeMoreBtn.innerHTML = "Read More";
        }
    });
}
// To Set Limit & function for input Count in Create Post Popup
function limitText(limitField, limitCount, limitNum) {
    if (limitField.value.length > limitNum) {
        limitField.value = limitField.value.substring(0, limitNum);
    } else {
        limitCount.value = limitNum - limitField.value.length;
    }
}
// Function if admin clicked checkbox
function chkBoxSelect(adminApprovalCheckBox) {
    if (adminApprovalCheckBox.checked === true) {
        let adminSelectUserName = adminApprovalCheckBox.nextSibling;
        if (confirm("Do you want to allow this post to be visible to other users?")) {
            let selectUserPopup = document.getElementById("selectUserPopup");
            markContainer.style.display = "flex";
            selectUserPopup.style.display = "block";
            // myProfileDiv.style.display = "none";
            let createUserForPost = document.getElementById("createUserForPost");
            createUserForPost.innerHTML = "";
            let postArray = JSON.parse(localStorage.getItem("objectDetailUser"));
            postArray.forEach(function (e) {
                if (e.role !== "admin") {
                    if (e.username !== adminSelectUserName.innerText) {
                        let createUserForPost = document.getElementById("createUserForPost");
                        let divForUser = createTableElements(createUserForPost, "div", "divSelUser", null, null, null, null);
                        let selInputBox = createTableElements(divForUser, "input", "selCheckBox", null, null, null, null);
                        selInputBox.setAttribute("type", "checkbox");
                        let allUserName = createTableElements(divForUser, "span", null, null, null, null, null);
                        allUserName.innerText = e.username;
                    }
                }
            });
        }
        else {
            let adminSelectedUserName = adminApprovalCheckBox.nextSibling.nextSibling;
            let postArray = JSON.parse(localStorage.getItem("userPosts"));
            postArray.forEach(function (e) {
                if (e.date === adminSelectedUserName.innerText) {
                    e.approved = true;
                    localStorage.setItem("userPosts", JSON.stringify(postArray));
                }
            });
        }
    }
}
// User Select for Post By Admin Submit Btn Click Event
function userSelectedBtn() {
    let selCheckBox = document.querySelectorAll(".selCheckBox");
    let postForSelectedUserArray = [];
    for (i = 0; i < selCheckBox.length; i++) {
        if (selCheckBox[i].checked === true) {
            postForSelectedUserArray.push(selCheckBox[i].nextSibling.innerText);
        }
    }
    appendArrayToLocalStorage(postForSelectedUserArray);   
    pendingPost();
}
// To set the user to sharePost of selected post to local Storage
function appendArrayToLocalStorage(postForSelectedUserArray) {
    let postArray = JSON.parse(localStorage.getItem("userPosts"));
    let userNameOfSelectedPost = document.querySelectorAll(".adminApprovalCheckBox");
    for (i = 0; userNameOfSelectedPost.length; i++) {
        if (userNameOfSelectedPost[i].checked === true) {
            var selPostDate = userNameOfSelectedPost[i].nextSibling.nextSibling.innerText;
            break;
        }
    }
    postArray.forEach(function (e) {
        if (e.date === selPostDate) {
            e.approved = true;
            e.sharePost = postForSelectedUserArray;
            localStorage.setItem("userPosts", JSON.stringify(postArray));
        }
    });
    markContainer.style.display = "none";
}
// Setup for Pagination 
function setupPagination(items, wrapper, rowsperpage, currentpage, paginationWrapper, approval) {
    debugger;
    wrapper.innerHTML = "";
    let pagecount = Math.ceil(items.length / rowsperpage);
    let selectPageRow = createTableElements(wrapper, "select", "select", null, null, null, null);
    let option0 = createTableElements(selectPageRow, "option", null, null, null, "Please Select Page Size", null);
    // option0.setAttribute("selected", "selected");
    option0.disabled = true;
    let option1 = createTableElements(selectPageRow, "option", null, null, null, 5, null);
    option1.value = 5;    
    let option2 = createTableElements(selectPageRow, "option", null, null, null, 10, null);
    option2.value = 10;
    let option3 = createTableElements(selectPageRow, "option", null, null, null, 20, null);
    option3.value = 20;
    selectPageRow.addEventListener("change", function () {
        debugger;
        allOption = selectPageRow.querySelectorAll("option");
        let rowsPerPage = selectPageRow.value;
        for (i = 0; i < allOption.length; i++) {
            if (selectPageRow.value === allOption[i].value) {
                allOption[i].setAttribute("selected", "selected");
            }
            break;
        }        
        rowsperpage = rowsPerPage;
        displayList(items, paginationWrapper, rowsperpage, currentpage, approval);
        setupPagination(items, wrapper, rowsperpage, currentpage, paginationWrapper, approval)
    });
    if(selectPageRow !== null){
        allOption = selectPageRow.querySelectorAll("option");
        // let rowsPerPage = selectPageRow.value;
        for (i = 0; i < allOption.length; i++) {
            if (rowsperpage == allOption[i].value) {
                allOption[i].setAttribute("selected", "selected");
            }
        }    
    }
    let firstBtn = createTableElements(wrapper, "button", "pageButton", null, null, "First", true);
    firstBtn.addEventListener("click", function () {
        currentpage = 1;
        btnClick(items, paginationWrapper, rowsperpage, currentpage, firstBtn, approval, wrapper, pagecount);
    });
    let nextBtn = createTableElements(wrapper, "button", "pageButton", null, null, "Next", true);
    nextBtn.addEventListener("click", function () {
        currentpage = currentpage + 1;
        btnClick(items, paginationWrapper, rowsperpage, currentpage, nextBtn, approval, wrapper, pagecount);
    });
    for (let i = 1; i < pagecount + 1; i++) {
        let btn = paginationButton(i, items, currentpage, rowsperpage, paginationWrapper, pagecount, wrapper, approval);
        wrapper.appendChild(btn);
    }
    let previousBtn = createTableElements(wrapper, "button", "pageButton", null, null, "Prev", true);
    previousBtn.addEventListener("click", function () {
        currentpage = currentpage - 1;
        btnClick(items, paginationWrapper, rowsperpage, currentpage, previousBtn, approval, wrapper, pagecount);

    });
    let lastBtn = createTableElements(wrapper, "button", "pageButton", null, null, "Last", true);
    lastBtn.addEventListener("click", function () {
        currentpage = pagecount;
        btnClick(items, paginationWrapper, rowsperpage, currentpage, lastBtn, approval, wrapper, pagecount);
    });
    conditionForButtons(currentpage, pagecount, wrapper);
}
// Condition For Buttons when to active and remove...
function conditionForButtons(currentpage, pagecount, wrapper) {
    let buttonCondition = wrapper.querySelectorAll(".pageButton");
    let allButton = wrapper.querySelectorAll("button");
    for (i = 0; i < buttonCondition.length; i++) {
        if (currentpage === 1 && currentpage !== pagecount) {
            buttonCondition[0].disabled = true;
            buttonCondition[2].disabled = true;
            buttonCondition[1].disabled = false;
            buttonCondition[3].disabled = false;
            loopConditionForButton(buttonCondition);
        }
        else if (currentpage === pagecount && currentpage !== 1) {
            buttonCondition[0].disabled = false;
            buttonCondition[2].disabled = false;
            buttonCondition[1].disabled = true;
            buttonCondition[3].disabled = true;
            loopConditionForButton(buttonCondition);
        }
        else if (currentpage === pagecount && currentpage === 1) {
            buttonCondition[i].disabled = true;
            loopConditionForButton(buttonCondition);
        }
        else {
            buttonCondition[i].disabled = false;
            loopConditionForButton(buttonCondition);
        }
    }
    for (j = 0; j < allButton.length; j++) {
        if (currentpage == allButton[j].innerText) {
            allButton[j].classList.add("active");
        }
        else {
            allButton[j].classList.remove("active");
        }
    }
}
// Function Button Color..
function loopConditionForButton(buttonCondition) {
    if (buttonCondition[i].disabled === true) {
        buttonCondition[i].style.backgroundColor = "rgb(204,204,204)";
    }
    else {
        buttonCondition[i].style.backgroundColor = "#44AAEE";
    }
}
// Loop for Button create for Pagination
function paginationButton(page, items, currentpage, rowsperpage, paginationWrapper, pagecount, wrapper, approval) {
    let button = document.createElement('button');
    button.innerText = page;
    if (currentpage == page) button.classList.add('active');
    button.addEventListener('click', function () {
        currentpage = page;
        btnClick(items, paginationWrapper, rowsperpage, currentpage, button, approval, wrapper, pagecount);
    });
    return button;
}
// all Function Button Click
function btnClick(items, paginationWrapper, rowsperpage, currentpage, clickBtn, approval, wrapper, pagecount) {
    conditionForButtons(currentpage, pagecount, wrapper);
    loadingStartAndStop();
    displayList(items, paginationWrapper, rowsperpage, currentpage, approval);   
    clickBtn.classList.add('active');
}
// Function For Loading Div
function loadingStartAndStop() {
    setTimeout(loadingWait, 0010)
    setTimeout(stopLoadWait, 3000)
}
// Function To Display Load Div
function loadingWait() {
    let loadingDiv = document.getElementById("loadingDiv");
    loadingDiv.style.display = "flex";
}
// Function To Hide Load Div
function stopLoadWait() {
    let loadingDiv = document.getElementById("loadingDiv");
    loadingDiv.style.display = "none";
}