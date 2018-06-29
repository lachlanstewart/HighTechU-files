//Make sure the database connection works
var ref = firebase.database().ref();
console.log(ref);
var currentUser = new Object();

firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        //Go to profile page
        currentUser.uid = firebaseUser.uid;
        currentUser.email = firebaseUser.email;
        firebase.database().ref('/users/' + firebaseUser.uid).once('value').then(function(snapshot) {
            currentUser.username = snapshot.val().username;
            currentUser.photo = snapshot.val().photo;
          });
        populateEvents();
        //window.location = "index.html";
    } else {
        //No user signed in
    }
  });

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
		window.location = "loginform.html";
        alert("Successfully signed out.");
      }).catch(function(error) {
        // An error happened.
        alert(error);
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

function usergoing(postId) {
  postData = {
    email: currentUser.email,
    name: currentUser.username
  };
  firebase.database().ref('events/' + postId + '/going/' + currentUser.uid).set(postData,function(error) {
    if (error) {
      alert("Data could not be saved." + error);
    } else {
      alert("You are going!");
      populateEvents();
    }
  });

}

function populateEvents() {
  document.getElementById('eventList').innerHTML = '';
  var postRef = firebase.database().ref('events')
  postRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();

          var usersGoing = [];
          var goingList = '';

          firebase.database().ref('events/'+ childKey + '/going').once('value', function(goingSnapshot) {
              goingSnapshot.forEach(function(cSnapshot) {
                var goingKey = cSnapshot.key;
                var goingData = cSnapshot.val();

                usersGoing.push(goingData.email);
              });

              var div = document.createElement('div');

              div.className = 'post';

              var eventHTML =
              '<p id="ename">'+childData.title+'</p>\
                <p id="edate">'+ childData.date +'</p>\
                <img src="http://kidsahead.com/system/ka_heros/15/original/Deep%20Space.jpg?1334673772" class="eimage">\
                <span>\
                  <button id="egoing" type="submit" onclick="usergoing(\'' + childKey + '\')">I\'m going</button>\
                </span>\
                <div class="dropdown">\
                  <button id="epeople" type="submit">See who\'s going</button>\
                  <div class="dropdown-content">';
                    usersGoing.forEach(function(entry) {
                      goingList += '<p>'+ entry +'</p>'
                  });
                  div.innerHTML = eventHTML + goingList + '</div>\
                  <p id="edesc">'+childData.description+'</p>\
                </div>';

              document.getElementById('eventList').appendChild(div);
          });
          // ...
      });
  });
}
