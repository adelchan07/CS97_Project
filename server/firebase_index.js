// firebase_index.js - server for project

// import express library
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

// global database constant.
const db = admin.firestore();

// global firebase collection constant
const events = db.collection('events');


/* GET REQUESTS */

// retrieve events of spec user on spec day
app.get('/events/:uid/:calendarMonth/:calendarDay', async (req, res) => {
    const uid = req.params.uid;
    const calendarMonth = parseInt(req.params.calendarMonth, 10);
    const calendarDay = parseInt(req.params.calendarDay, 10);
    
    // retrieve events that fit criteria
    const allEventRefs = await events.where('eventMonth', '==', calendarMonth).where('eventDay', '==', calendarDay).where('uid', '==', uid)
                                .orderBy('eventStartHour').orderBy('eventStartMinute')
                                .orderBy('eventEndHour').orderBy('eventEndMinute')
                                .orderBy('eventName').get();
    const allEvents = [];
    const allEventsStr = [];
    
    // fill array of events
    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    // type conversions to display properly
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
    // display formatting modifications
        if(docStrCpy.eventStartMinute.length === 1) {
            docStrCpy.eventStartMinute = '0' + docStrCpy.eventStartMinute;
        }

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
    
    // fill new event fields
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
    // place new event in database
    await events.doc().set(newEvent);
    res.status(201);
    res.json({ message: 'Event created' });
});


// Starting up the server
app.listen(3200, () => {
    console.log('Server has started');
});

