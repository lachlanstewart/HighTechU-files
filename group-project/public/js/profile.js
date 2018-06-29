/* Your JS codes here */
//Make sure the database connection works
var ref = firebase.database().ref();
console.log(ref);
var currentUser = new Object();

firebase.auth().onAuthStateChanged(firebaseUser => {
    var updateEmail = document.getElementById('updateEmail');
    var updatePhoto = document.getElementById('updatePhoto');
    var updateName = document.getElementById('updateName');

    if(firebaseUser) {
        //Fill the textboxes with the user's info
        currentUser.uid = firebaseUser.uid;
        firebase.database().ref('/users/' + firebaseUser.uid).once('value').then(function(snapshot) {
            currentUser.username = snapshot.val().username;
            currentUser.photo = snapshot.val().photo;

            updateName.value = currentUser.username;
            updatePhoto.value = currentUser.photo;
        });

        updateEmail.value = firebaseUser.email;
        populate();
    } else {
        window.location = "loginform.html";
    }
});

function wall() {
    window.location = "index.html";
}

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        alert("Successfully signed out.");
      }).catch(function(error) {
        // An error happened.
        alert(error);
      });
}

function populate() {
    var user = firebase.auth().currentUser;

    if (user) {
        var txtEmail = document.getElementById('populateEmail');
        var txtName = document.getElementById('populateName');
        var txtPhoto = document.getElementById('populatePhoto');

        firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
            txtName.innerText = snapshot.val().username;
            txtPhoto.src = snapshot.val().photo;
            // ...
        });
        txtEmail.innerText = user.email;
    }
}

function updateUser() {
    var user = firebase.auth().currentUser;
    var txtEmail = document.getElementById('updateEmail');
    var txtName = document.getElementById('updateName');
    var txtPhotoUrl = document.getElementById('updatePhoto');

    user.updateEmail(txtEmail.value).then(function() {
        // Update successful.
        populate();
        alert("User updated successfully.");
    }).catch(function(error) {
        // An error happened.
        alert(error);
        return;
    });

    var userId = user.uid;
    firebase.database().ref('users/' + userId).set({
        username: txtName.value,
        photo : txtPhotoUrl.value
    });
}

for(var cell of document.querySelectorAll(".form-control")) {
    cell.addEventListener("keyup", function(event) {
        if(event.key !== "Enter") return; // Use `.key` instead.
        document.querySelector("#btnUpdate").click(); // Things you want to do.
        event.preventDefault(); // No need to `return false;`.
    })
};
