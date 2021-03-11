// index.js - server for project
// General strategy: 
// GET /events to retreive events
// POST /events to create new event
// DELETE /events/<event id> to delete event
// PUT/PATCH /events/<event id> to update event
// CONNECT to login user

// import express library (could be http as well but harder)
const express = require('express');

// Cross Origin Resource Sharing
const cors = require('cors');
const bodyParser = require('body-parser');

// create server object with express library
const app = express();
app.use(bodyParser.json());
app.use(cors());


// import the Firebase library.
const admin = require('firebase-admin');

// import the password.
const databasePassword = require('./firebase-password.json');

// tell the library to connect to the database for us using the given password.
admin.initializeApp({
    credential: admin.credential.cert(databasePassword)
});

// this is our database object.
const db = admin.firestore();

// adding data to firebase
const events = db.collection('events');


/* GET REQUESTS */


// retrieve events of spec user on spec day
app.get('/events/:uid/:eventMonth/:eventDay', async (req, res) => {
    const uid = req.params.uid;
    const eventMonth = parseInt(req.params.eventMonth, 10);
    const eventDay = parseInt(req.params.eventDay, 10);

    const allEventRefs = await events.where('eventMonth', '==', eventMonth).where('eventDay', '==', eventDay).where('uid', '==', uid)
                                .orderBy('eventStartHour').orderBy('eventStartMinute')
                                .orderBy('eventEndHour').orderBy('eventEndMinute')
                                .orderBy('eventName').get();
    const allEvents = [];
    const allEventsStr = [];

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    allEvents.forEach(doc => {
        var docStrCpy = {
            uid: doc.uid, 
            eventName: doc.eventName,
            eventMonth: doc.eventMonth +'',
            eventDay: doc.eventDay+'',
            eventStartHour: doc.eventStartHour+'',
            eventStartMinute: doc.eventStartMinute+'',
            eventEndHour: doc.eventEndHour+'',
            eventEndMinute: doc.eventEndMinute+'',
        }
        // if(docStrCpy.eventStartHour.length === 1) {
        //     docStrCpy.eventStartHour = '0' + docStrCpy.eventStartHour;
        // }
        if(docStrCpy.eventStartMinute.length === 1) {
            docStrCpy.eventStartMinute = '0' + docStrCpy.eventStartMinute;
        }
        // if(docStrCpy.eventEndHour.length === 1) {
        //     docStrCpy.eventEndHour = '0' + docStrCpy.eventEndHour;
        // }
        if(docStrCpy.eventEndMinute.length === 1) {
            docStrCpy.eventEndMinute = '0' + docStrCpy.eventEndMinute;
        }


        allEventsStr.push(docStrCpy);
    });

    res.status(200);
    res.json(allEventsStr);
});



/* POST REQUESTS */

// create a new event
app.post('/events', async (req, res) => {  

    const newEvent = {
        uid: req.body.uid, 
        eventName:  req.body.eventName,
        eventMonth: parseInt(req.body.eventMonth, 10),
        eventDay: parseInt(req.body.eventDay, 10),
        eventStartHour: parseInt(req.body.eventStartHour, 10),
        eventStartMinute: parseInt(req.body.eventStartMinute, 10),
        eventEndHour: parseInt(req.body.eventEndHour, 10),
        eventEndMinute: parseInt(req.body.eventEndMinute, 10),
    };
    await events.doc().set(newEvent);
    res.status(201);
    res.json({ message: 'Event created' });
});


// Starting up the server
app.listen(3200, () => {
    console.log('Server has started');
});

