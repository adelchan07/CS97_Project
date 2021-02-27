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
const app = express();
app.use(cors());
app.use(bodyParser.json());

// import the Firebase library.
const admin = require('firebase-admin');

// import the password.
const databasePassword = require('./firebase-password.json');

// tell the library to connect to the database for us 
// using the given password.
admin.initializeApp({
    credential: admin.credential.cert(databasePassword)
});

// this is our database object.
const db = admin.firestore();

// Creating a GET request handler
/* handle request on URL which is denoted by '/****', sends "Hello world!" back to client
   two arguments:
   req (request) - contain information related to clients request to the server 
   res (response) - send a response back to the client
*/

// const users = [
//     {
//         userName: 'Kyle Ogata',
//         password: 'whysomuchsyntax',
//         //calendars: events,
//     },
// ];

// adding data to firebase
const events = db.collection('events');

/* 
    const events = [
    {
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
*/

// retrieve all upcoming events:
app.get('/events', async (req, res) => {
    const allEvents = [];
    const allEventRefs = await events.get();

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    res.status(200);
    res.json(allEvents);
});

// retrieve specific event:
app.get('/events/:id', async (req, res) => {
    const id = req.params.id;
    const eventRef = await events.doc(id).get();
    if(!eventRef.exists) {
        res.status(404);
        res.json({ message: 'Event does not exist'});
        return;
    }
    res.json(eventRef.data());
});

// create a new event
app.post('/events', async (req, res) => {  
    // const event = req.body;
    // event.id = currentId;
    // currentId++;
    // events.push(event);
    // res.send({ success: true });
    const id = req.body.id
    const event = {
        eventName: req.body.eventName,
        // startDay: req.body.startDay,
        // endDay: req.body.endDay,
        // startHour: req.body.startHour,                      // maybe start(end)Hour and start(end)Minutes  so less parsing
        // startMinute: req.body.startMinute,
        // endHour: req.body.endHour,                        // for simplicity utilize 24 hour clock
        // endMinute: req.body.endMinute,
        // notificationMinute: req.body.notificationMinute,             // input as minutes
        // location: req.body.location,
        // description: req.body.description,
        // unsure about adding
        calendarOwner: req.body.calendarOwner,
        // calenderName: req.body.calenderName,
        // color: req.body.color,
    }
    await events.doc(id).set(event);

    res.status(201);
    res.json({ message: 'Event created' });

});

/* IMPORTANT NOTE FROM FIREBASE ABOUT DELETING DOCUMENTS: 
When you delete a document that has subcollections, 
those subcollections are not deleted. For example, 
there may be a document located at coll/doc/subcoll/subdoc 
even though the document coll/doc no longer exists. 
If you want to delete documents in subcollections when 
deleting a parent document, you must do so manually, 
as shown in Delete Collections.
https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
*/


// app.delete('/events/:eventId', (req, res)=> {
//     const eventId = parseInt(req.params.eventId)  // returns some ID: '0'
//     for (let i = 0; i < events.length; i++) {
//         if (events[i].id === eventId) {
//             events.splice(i,1);
//             res.send({ success: true });
//         }
//     }
// });

// app.patch('/events/:eventId', (req, res)=> {
//     const eventId = parseInt(req.params.eventId)  // returns some ID: '0'
//     for (let i = 0; i < events.length; i++) {
//         if (events[i].id === eventId) {
//             Object.assign(events[i], req.body);
//             res.send({ success: true });
//         }
//     }
// });




// Starting up the server
app.listen(3000, () => {
    console.log('Server has started');
});

