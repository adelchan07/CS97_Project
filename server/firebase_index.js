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
app.use(cors());
app.use(bodyParser.json());

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
const users = db.collection('users');


/* GET REQUESTS */

// retrieve all upcoming users:
app.get('/users', async (req, res) => {
    const allUsers = [];
    const allUserRefs = await users.get();

    allUserRefs.forEach(doc => {
        allUsers.push(doc.data());
    });

    res.status(200);
    res.json(allUsers);
});

// retrieve specific user info:
app.get('/:username', async (req, res) => {
    const username = req.params.username;
    const userRef = await users.doc(username).get();
    if(!userRef.exists) {
        res.status(404);
        res.json({ message: 'User does not exist'});
        return;
    }
    res.json(userRef.data());
});

// retrieve list of user events:
app.get('/:username/events', async (req, res) => {
    const username = req.params.username;
    const events = users.doc(username).collection('events');
    const allEvents = [];
    const allEventRefs = await events.get();
    
    console.log(allEventRefs);

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    res.status(200);
    res.json(allEvents);
});

// retrieve events in specific calendar: GOOD
app.get('/:username/events/cal/:calendars', async (req, res) => {
//     const username = req.params.username;
//     const calendarName = req.params.calendars;
//     const calendars = users.doc(username).collection('calendars');
//     const events = calendars.doc(calendarName).collection('events');
//     const allEvents = [];
//     const allEventRefs = await events.get();

//     allEventRefs.forEach(doc => {
//         allEvents.push(doc.data());
//     });

//     res.status(200);
//     res.json(allEvents);

    const username = req.params.username;
    const calendarName = req.params.calendars;
    const events = users.doc(username).collection('events');
    const allEvents = [];
    const allEventRefs = await events.where('calendar', '==', calendarName).get();

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    res.status(200);
    res.json(allEvents);
});

// retrieve events on specific day
app.get('/:username/events/day/:day', async (req, res) => {
    const username = req.params.username;
    const dayOfWeek = req.params.day;
    const events = users.doc(username).collection('events');
    const allEventRefs = await events.where('day', '==', dayOfWeek).get();
    const allEvents = [];    

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    res.status(200);
    res.json(allEvents);
});

// retrieve events on spec day in spec cal (cal first in endpoint): GOOD
app.get('/:username/events/cal/:calendars/day/:day', async (req, res) => {
    const username = req.params.username;
    const calendarName = req.params.calendars;
    const dayOfWeek = req.params.day;
    const events = users.doc(username).collection('events');
    const allEventRefs = await events.where('day', '==', dayOfWeek).where('calendar', '==', calendarName).get();
    const allEvents = [];

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    res.status(200);
    res.json(allEvents);
});

// retrieve events on spec day in spec cal (day first in endpoint): GOOD
app.get('/:username/events/day/:day/cal/:calendars', async (req, res) => {
    const username = req.params.username;
    const calendarName = req.params.calendars;
    const dayOfWeek = req.params.day;
    const events = users.doc(username).collection('events');
    const allEventRefs = await events.where('day', '==', dayOfWeek).where('calendar', '==', calendarName).get();
    const allEvents = [];

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    res.status(200);
    res.json(allEvents);
});



/* POST REQUESTS */

// create a new user
app.post('/users', async (req, res) => {  
    const username = req.body.username      // id tag (can change later to random unique key)
    // if (users.doc(username).exists()) {
    //     res.status(406);
    //     res.json({message: "User already exists"});
    //     return;
    // }
    const newUser = {
        username: req.body.username,
        password: req.body.password,
    }
    await users.doc(username).set(newUser);

    // // create default 'general' calendar
    // const calendars = users.doc(username).collection('calendars');
    // const newCalendar = {
    //     calendarName: "general",
    // }
    // await calendars.doc("general").set(newCalendar);

    res.status(201);
    res.json({ message: 'User created' });

});

// create a new event
app.post('/:username/events', async (req, res) => {  
    const username = req.params.username
    const events = users.doc(username).collection('events');
    // create calendar if one does not exist
    // if (!calendars.doc(calendarName).exists()) {
    //     const newCalendar = {
    //         calendarName: calendarName,
    //     }
    //     await calendars.doc(calendarName).set(newCalendar);
    // }

    const newEvent = {
        user: username, // to identify whose events belong to who

        eventName: req.body.eventName,
        day: req.body.day,
        calendar: req.body.calendar,
        
        // startHour: req.body.startHour,                      
        // startMinute: req.body.startMinute,
        // startAM: req.body.startAM,
        // endHour: req.body.endHour,                        
        // endMinute: req.body.endMinute,
        // endAM: req.body.endAM,

        notificationMinute: req.body.notificationMinute,             
        location: req.body.location,
        description: req.body.description,
    }
    await events.doc().set(newEvent);

    res.status(201);
    res.json({ message: 'Event created' });

});

// // create a new calendar
// app.post('/:username/calendars', async (req, res) => {  
//     const username = req.params.username;
//     const calendarName = req.body.calendarName;             // id tag (can change later to random unique key)
//     const calendars = users.doc(username).collection('calendars');
//     const newCalendar = {
//         calendarName: req.body.calendarName,
//     }
//     await calendars.doc(calendarName).set(newCalendar);
//     res.status(201);
//     res.json({ message: 'Calendar created' });

// });


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

/* DELETE REQUESTS */

// app.delete('/events/:eventId', (req, res)=> {
//     const eventId = parseInt(req.params.eventId)  // returns some ID: '0'
//     for (let i = 0; i < events.length; i++) {
//         if (events[i].id === eventId) {
//             events.splice(i,1);
//             res.send({ success: true });
//         }
//     }
// });

/* PATCH REQUESTS (to edit) */

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
app.listen(3200, () => {
    console.log('Server has started');
});

