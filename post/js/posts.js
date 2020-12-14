var createPostPopup = document.getElementById("createPostPopup");
// To Create New Post pop up 
function PopupClickEvent() {
    markContainer.style.display = "flex";
    createPostPopup.style.display = "block";
    selectUserPopup.style.display = "none";
}
// Function for Create Post Pop Up by user and admin
let userTextPost = document.getElementById("userTextPost");
function createPost() {
    if (validateUserPost(userTextPost)) {
        createPostArrayObjectCreate();
        resetPost();
        allPost();
        pendingPost();
        promotionalPost();
    }
}
// PopUp Close Button Click event
closeDynamic.addEventListener("click", function () {
    markContainer.style.display = "none";
    resetPost();
    allPost();
    pendingPost();
    promotionalPost();
});
// Validation for Create Post
function validateUserPost(userTextPost) {
    let isAllValidationPassed = true;
    if (userTextPost.value.trim() === ""){
        userTextPost.classList.add("validateRedBorder")
        isAllValidationPassed = false;
    }
    else {
        userTextPost.classList.add("validateGreenBorder")
    }
    return isAllValidationPassed;
}
// Function to store post in local storage
function createPostArrayObjectCreate() {
    let userTextPost = document.getElementById("userTextPost");
    let postObject = {};
    postObject.post = userTextPost.value;
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    postObject.date = date + ' ' + time;
    postObject.username = loggedInUser.username;
    if (loggedInUser.role === "admin") {
        postObject.approved = true;
        let createArray = [];
        objectDetailUser.forEach(e => {
            createArray.push(e.username);
        });
        postObject.sharePost = createArray;
    }
    else {
        postObject.approved = false;
        postObject.sharePost = "";
    }
    if (localStorage.getItem("userPosts") === null) {
        let postArray = [];
        postArray.push(postObject);
        localStorage.setItem("userPosts", JSON.stringify(postArray));
    }
    else {
        let postArray = JSON.parse(localStorage.getItem("userPosts"));
        postArray.push(postObject);
      localStorage.setItem("userPosts", JSON.stringify(postArray));
    }
}
// Function to reset value and close popUp
function resetPost() {
    userTextPost.value = "";
    markContainer.style.display = "none";
    userTextPost.classList.remove("validateGreenBorder")
    document.getElementById("outputText").value = 500;    
}
window.addEventListener('load', 
  function() { 
    document.getElementById("allPost").click();    
    let promotionalPost = document.getElementById("promotionalPost");
    if (loggedInUser.role === "user") {
        promotionalPost.style.display = "none";
    }
    else {
        promotionalPost.style.display = "block";
    }
    document.getElementById("postContentDisplay").style.display = "block";
  }, false);
// All Post Click Event
function allPost() {    
    let postDisplayDivDynamically = document.getElementById("postDisplayDivDynamically");
    let AdminApproval = true;
    let paginationElementForPost = document.getElementById("pagination1");
    removeLocalStorage();
    allPostClick(postDisplayDivDynamically, AdminApproval);
    let listItemFromPost = JSON.parse(localStorage.getItem("postForallPost"));
    launchEventsForTab(listItemFromPost,paginationElementForPost, postDisplayDivDynamically, AdminApproval);
}
// Pending Post Click Event
function pendingPost() {
    debugger;
    let postDisplayDivDynamicallyForApproval = document.getElementById("postDisplayDivDynamicallyForApproval");
    let userApproval = false;
    let paginationElementForPostButton= document.getElementById("pagination");
    removeLocalStorage();
    allPostClick(postDisplayDivDynamicallyForApproval, userApproval);    
    let listItemForPending = JSON.parse(localStorage.getItem("postForPending"));
    launchEventsForTab(listItemForPending,paginationElementForPostButton, postDisplayDivDynamicallyForApproval, userApproval);
}
// Promotional Post Click Event
function promotionalPost() {
    let postDisplayDivForAdmin = document.getElementById("postDisplayDivForAdmin");
    let AdminApprovalDiv = "showToAdmin";
    let paginationElementForPostDiv = document.getElementById("pagination2"); 
    removeLocalStorage();
    allPostClick(postDisplayDivForAdmin, AdminApprovalDiv);   
    let listItemFromAdmin = JSON.parse(localStorage.getItem("postByAdmin"));
    if(loggedInUser.role === "admin"){
        launchEventsForTab(listItemFromAdmin,paginationElementForPostDiv, postDisplayDivForAdmin, AdminApprovalDiv);
    }
}
// Function for Tab
function openPage(pageName, elmnt, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {        
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
    avoidCreatePostToAdmin();
}
// function to stop Admin to create Post
function avoidCreatePostToAdmin() {
    if (loggedInUser.role === "admin") {
        document.getElementById("createNewPostBtn1").style.display = "none";
        document.getElementById("createNewPostBtn2").style.display = "none";
    }
}
// function for Post Event Common Function
function launchEventsForTab(listItem,secondaryWrapper, mainWrapper, approvals){
    debugger;
    var currentpage = 1;
    let rows = 5;
    mainWrapper.innerHTML = "";
    if (mainWrapper.innerHTML === "" && listItem !== null && listItem !== undefined) {
        loadingStartAndStop();
        displayList(listItem, mainWrapper, rows, currentpage, approvals);
        setupPagination(listItem, secondaryWrapper, rows, currentpage, mainWrapper, approvals);        
    } 
}
function removeLocalStorage(){
    localStorage.removeItem("postForallPost");
    localStorage.removeItem("postForPending");
    localStorage.removeItem("postByAdmin");
}