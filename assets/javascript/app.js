// Initialize Firebase
var config = {
    apiKey: "AIzaSyBmxzKiYMzrBerGbnY_GJPqGWFnEbxve8Q",
    authDomain: "train-scheduler-386ce.firebaseapp.com",
    databaseURL: "https://train-scheduler-386ce.firebaseio.com",
    projectId: "train-scheduler-386ce",
    storageBucket: "",
    messagingSenderId: "983296049852"
};
  
firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destinationCity = $("#destination-input").val().trim();
    var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").subtract(1, "years").format("X");
    var frequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
      train: trainName,
      city: destinationCity,
      first: firstTrain,
      freq: frequency
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.train);
    console.log(newTrain.city);
    console.log(newTrain.first);
    console.log(newTrain.freq);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });

console.log(database);
console.log(database.ref);

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().train;
    var destinationCity = childSnapshot.val().city;
    var firstTrain = childSnapshot.val().first;
    var frequency = childSnapshot.val().freq;
  
    // Employee Info
    console.log(trainName);
    console.log(destinationCity);
    console.log(firstTrain);
    console.log(frequency);

    var diffTime = moment().diff(moment.unix(firstTrain), "minutes");
	var timeRemainder = diffTime % frequency;
	var minutesToArrival = frequency - timeRemainder;

	var nextTrainArrival = moment().add(minutesToArrival, "m").format("hh:mm A"); 
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destinationCity),
      $("<td>").text(frequency),
      $("<td>").text(minutesToArrival),
      $("<td>").text(nextTrainArrival),
    );
  
    // Append the new row to the table
    $("#train-schedule-table > tbody").append(newRow);
  });