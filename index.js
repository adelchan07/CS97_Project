// index.js - server for project
// General strategy: 
// GET /events to retreive events
// POST /events to create new event
// DELETE /events/<event id> to delete event
// PUT/PATCH /events/<event id> to update event
// CONNECT to login user
// need database to hold events for users.

// import express library (could be http as well but harder)
const express = require('express');

// Cross Origin Resource Sharing
const cors = require('cors');
const bodyParser = require('body-parser');

// create server object with express library
const server = express();
server.use(cors());
server.use(bodyParser.json());
// Creating a GET request handler
/* handle request on URL which is denoted by '/****', sends "Hello world!" back to client
   two arguments:
   req (request) - contain information related to clients request to the server 
   res (response) - send a response back to the client
*/
server.get('/abc', (req, res) => {
    res.send('get request!');
});

server.post('/abc', (req, res) => {
    res.send('post request');
});

// NOTE: for project you need a database to store data
const users = [
    {
        userName: 'Kyle Ogata',
        password: 'whysomuchsyntax',
        //calendars: events,
    },
];

const events = [
    {
        id: '0',
        EventName: 'CS 97 Lecture',
        startDay: 'Monday',
        endDay: 'Monday',
        startHour: '12',                      // maybe start(end)Hour and start(end)Minutes  so less parsing
        startMinute: '0',
        endHour: '13',                        // for simplicity utilize 24 hour clock
        endMinute: '50',
        notificationMinute: '30',             // input as minutes
        location: "Eggert's Zoom Room",
        description: 'Should I stay or should I go?',
        // unsure about adding
        calendarOwner: 'Kyle Ogata',
        calenderName: 'School',
        color: 'blue',
    },
];

// create ID system to identify events
let currentId = 1;

// retrieve all upcoming events:
server.get('/events', (req, res) => {
    res.send(events);
});

// create a new event
server.post('/events', (req, res) => {  
    const event = req.body;
    event.id = currentId;
    currentId++;
    events.push(event);
    res.send({ success: true });
});

server.delete('/events/:eventId', (req, res)=> {
    const eventId = parseInt(req.params.eventId)  // returns some ID: '0'
    for (let i = 0; i < events.length; i++) {
        if (events[i].id === eventId) {
            events.splice(i,1);
            res.send({ success: true });
        }
    }
});

server.patch('/events/:eventId', (req, res)=> {
    const eventId = parseInt(req.params.eventId)  // returns some ID: '0'
    for (let i = 0; i < events.length; i++) {
        if (events[i].id === eventId) {
            Object.assign(events[i], req.body);
            res.send({ success: true });
        }
    }
});




// Starting up the server
server.listen(3000, () => {
    console.log('Server has started');
});

