let http = require('http');
let express = require("express");
let bodyParser = require("body-parser");
const { default: mongoose } = require('mongoose');
let app = express();

app.listen(69);

mongoose.connect(process.env.ATLAS_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

// Team.deleteMany({ teamName: req.body.username }).then(function() {
// console.log("Data deleted");
// }).catch(function(error) {
// console.log(error);
// });

let teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  password: { type: String, required: true },
  timeStamp: { type: String, required: true },
  submissions: { type: Number },
  accuracy: { type: Number },
  isLocked: { type: Boolean, required: true, default: false }
});

let Team = mongoose.model("Team", teamSchema);

app.use("/resources", express.static(__dirname + "/resources"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/submissionCopy.html");
});

app.get("/story-one", (req, res) => {
  res.sendFile(__dirname + "/storyOne.html");
});

app.get("/story-two", (req, res) => {
  res.sendFile(__dirname + "/storyTwo.html");
});

app.get("/story-three", (req, res) => {
  res.sendFile(__dirname + "/storyThree.html");
});

app.get("/story-four", (req, res) => {
  res.sendFile(__dirname + "/storyFour.html");
});

app.get("/story-five", (req, res) => {
  res.sendFile(__dirname + "/storyFive.html");
});

app.get("/story-six", (req, res) => {
  res.sendFile(__dirname + "/storySix.html");
});

app.get("/submission-page", (req, res) => {
  res.sendFile(__dirname + "/submission.html");
});

app.post("/submit-code", bodyParser.urlencoded({ extended: false }), (req, res) => {
  Team.find({ teamName: req.body.username }, (error, data) => {
    if (data.length == 0) {
      // creating a Team submission
      let temp = new Team({
        teamName: req.body.username,
        password: req.body.password,
        timeStamp: new Date().toLocaleString("en-IN"),
        submissions: 1
      })
      // saving Team Submission to DB
      temp.save((error, data) => {
        if (!error) {
          console.log("Team added");
        }
      })
    }
    else {
      if (!data[0].isLocked) {
        // update Team submission
        Team.updateOne({ teamName: req.body.username }, { $set: { password: req.body.password, submissions: ((data[0].submissions) + 1) } }, (error, data) => {
          if (!error) {
            console.log("Team updated");
          }
        });
      }
    }
    if (req.body.password == process.env.FAKE_KEY) {
      Team.updateOne({ teamName: req.body.username }, { $set: { isLocked: true } }, (error, data) => {
        if (!error) {
          console.log(new Date().toLocaleString());
          console.log(req.body.username + " has answered right!")
        }
      });
      res.sendFile(__dirname + "/successPage.html");
    }
    else {
      res.sendFile(__dirname + "/failurePage.html");
    }
  })
});