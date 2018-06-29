function addEvent1() {
    var description = document.getElementById('textArea');
    var dateTime = document.getElementById('dateTime');
    var title = document.getElementById('Title');

    var postData = {
        title: title.value,
        description: description.value,
        date: dateTime.value
    };
    if(postData.title == "" || postData.description == "" || postData.date == "") {
      alert("Error. Please give your event some details!");
      return;
    }
    var newPostKey = firebase.database().ref().child('events').push().key;
    firebase.database().ref('events/' + newPostKey).set(postData,function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        window.location = "index.html";
      }
    });
}

function wall() {
    window.location = "index.html";
}