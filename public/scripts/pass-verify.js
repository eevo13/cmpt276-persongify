var firstPwd = document.getElementById("pwd");
var secondPwd = document.getElementById("pwdChk");
var warning = document.getElementById("pwdWarning");
var submitBtn = document.getElementById("formSubmit");

secondPwd.addEventListener('blur', (event) => {
    if (firstPwd.value != secondPwd.value) {
        // give user error
        warning.style.display = "initial";
        // highlight cause of error
        secondPwd.style.border = "3px solid red";
        // remove submit button
        submitBtn.style.display = "none";
    } else {
        // remove error
        warning.style.display = "none";
        // remove highlighting
        // highlight cause of error
        secondPwd.style.border = "none";
        // put submit button back
        submitBtn.style.display = "initial";
    }
})