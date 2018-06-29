//Logging the database in the console
var ref = firebase.database().ref();
console.log(ref);

//code for redirecting to profile page using the firebase.auth().onAuthStateChanged

firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        //Go to profile page
        window.location = "index.html";
    } else {
        //No user signed in
    }
  });

function signup() {
//The code for signup functionality goes here
txtEmail = document.getElementById('signupEmail').value;
    txtPass = document.getElementById('signupPassword').value;
    chkTerms = document.getElementById('terms').checked;
    
    if(!chkTerms) {
        alert("You must accept the Terms and Conditions");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(txtEmail, txtPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + ": " + errorMessage);        
    });

}

function login() {
    //The code for login functionality goes here
    txtEmail = document.getElementById('loginEmail').value;
    txtPass = document.getElementById('loginPassword').value;
    
    firebase.auth().signInWithEmailAndPassword(txtEmail, txtPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + ": " + errorMessage);
    });
    
}

function resetPass() {
    //The code for reset password functionality goes here
    var auth = firebase.auth();
    var emailAddress = document.getElementById('loginEmail').value;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
    alert("Email sent")
    }).catch(function(error) {
    // An error happened.
    });
}