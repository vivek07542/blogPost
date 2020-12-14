var loginUserName = document.getElementById("loginUserName");
var userPassword = document.getElementById("userPassword");
var loginSubmit = document.getElementById("loginSubmit");
var textIfFail = document.getElementById("textIfFail");
loginSubmit.addEventListener("click",function(){
    if (validation()) {
        setDetailOfAdmin();
        verificationOfUser();
    };
});
function validation() {
    let isAllValidationPassed = true;
    if (loginUserName.value.trim() === "") {
        loginUserName.classList.add("validateRedBorder")
        isAllValidationPassed = false;
    }
    else {
        loginUserName.classList.add("validateGreenBorder")
    }
    if (userPassword.value.trim() === "") {
        userPassword.classList.add("validateRedBorder");
        isAllValidationPassed = false;
    }
    else {
        userPassword.classList.add("validateGreenBorder");
    }
    return isAllValidationPassed;
}
function setDetailOfAdmin() {
    if (localStorage.getItem("objectDetailUser") === null) {
        let userArrayDetail = [];
        let userDetail = {
            username: "vivek@123",
            password: "Vivek@123",
            role: "admin",
            firstname: "Vivek",
            lastname: "Bindal",
            phonenumber: 8888269609,
        }
        userArrayDetail.push(userDetail);
        localStorage.setItem("objectDetailUser", JSON.stringify(userArrayDetail));
    }
}
function verificationOfUser() {
    let arrayObjectAllUser = JSON.parse(localStorage.getItem("objectDetailUser"));
    for (let i = 0; i < arrayObjectAllUser.length; i++) {
        if (loginUserName.value === arrayObjectAllUser[i].username && userPassword.value === arrayObjectAllUser[i].password) {
            loginUserName.value = "";
            var selectedUser=arrayObjectAllUser[i];
            localStorage.setItem("loggedInUser",JSON.stringify(selectedUser)); 
            textIfFail.style.display = "none";
            loadingStartAndStop();
            setTimeout(function(){ document.location.href = "posts.html";}, 3000);  
            
            break;
        }
        else {
            textIfFail.style.display = "block";
        }
    }
}
function loadingWait(){
    let loadingDiv=document.getElementById("loadingDiv");      
    loadingDiv.style.display="flex";
   } 

function loadingStartAndStop(){
    setTimeout(loadingWait, 0010);
    setTimeout(stopLoadWait,3000);
}
   function stopLoadWait(){
    let loadingDiv=document.getElementById("loadingDiv");      
    loadingDiv.style.display="none";
   }