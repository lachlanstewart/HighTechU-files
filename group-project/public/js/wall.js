/* Your JS codes here */
//Make sure the database connection works
var ref = firebase.database().ref();
console.log(ref);
var currentUser = new Object();

firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        currentUser.uid = firebaseUser.uid;
        firebase.database().ref('/users/' + firebaseUser.uid).once('value').then(function(snapshot) {
            currentUser.username = snapshot.val().username;
            currentUser.photo = snapshot.val().photo;

            updatePosts();
        });
    } else {
        window.location = "login.html";
    }
});

firebase.database().ref('posts/').on('child_changed', function(data) {
    updatePosts();
});

function profile() {
    window.location = "profile.html";
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

function updatePosts() {
    document.getElementById('posts').innerHTML = '';
    var postRef = firebase.database().ref('posts/' + currentUser.uid)
    postRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            var div = document.createElement('div');

            div.className = 'form-group';

            div.innerHTML =
                '<label>' +
                childData.title + '</label>\
                <textarea class="form-control" placeholder="Enter Message" rows="7" disabled>' + childData.body + '</textarea>\
                <button class="btn btn-white pull-right" onclick="deletePost(\'' + childKey + '\')">Delete</button>';

            document.getElementById('posts').appendChild(div);
            // ...
        });
    });
}

function post() {
    var txtComments = document.getElementById('comments');
    var txtTitle = document.getElementById('title');

    var postData = {
        author: currentUser.username,
        body: txtComments.value,
        title: txtTitle.value
    };

    firebase.database().ref('posts/' + currentUser.uid).push(postData);
}

function deletePost(key) {
    firebase.database().ref('posts/' + currentUser.uid + '/' + key).remove();
}

for(var cell of document.querySelectorAll(".form-control")) {
    cell.addEventListener("keyup", function(event) {
        if(event.key !== "Enter") return; // Use `.key` instead.
        document.querySelector("#btnPost").click(); // Things you want to do.
        event.preventDefault(); // No need to `return false;`.
    })
};
