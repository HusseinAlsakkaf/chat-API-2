const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!"
}

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage]


app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

// Read all messages
app.get("/messages", (request, response) => {
  response.json(messages);
});
//add new message
app.post("/messages", function (request, response) {
  const data = request.body; 
  if(data.from.length > 0 && data.text.length ){
    data.id = messages.length;
    messages.push(data);
    response.send('the message was added');
  }else{
    response.json({ mess: "Please fill all the fields" }).sendStatus(400);
  }
  
});
// Read only the most recent 10 messages
app.get("/messages/latest", (request, response) => {
  response.json(messages.slice(-10));
});


// Read one message specified by an ID
app.get("/messages/:id", function (request, response) {
    const {id} = request.params;
    let selectedMessage = messages.filter(message => message.id == id);
    response.send(selectedMessage);
});

//Delete a message, by ID
app.delete("/messages/:id", function (request, response) {
    const {id} = request.params;
    messages.forEach((item,index) => {
      if(id == item.id){
        messages.splice(index,1);
        response.send(`Message id ${id} was deleted`);
      }
    })
});




app.listen(process.env.PORT);
