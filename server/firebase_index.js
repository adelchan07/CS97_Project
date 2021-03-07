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
const events = db.collection('events');


/* GET REQUESTS */

// retrieve all upcoming users:
// app.get('/users', async (req, res) => {
//     const allUsers = [];
//     const allUserRefs = await users.get();

//     allUserRefs.forEach(doc => {
//         allUsers.push(doc.data());
//     });

//     res.status(200);
//     res.json(allUsers);
// });

// retrieve specific user info:
// app.get('/:username', async (req, res) => {
//     const username = req.params.email;
//     const userRef = await users.doc(username).get();
//     if(!userRef.exists) {
//         res.status(404);
//         res.json({ message: 'User does not exist'});
//         return;
//     }
//     res.json(userRef.data());
// });

// retrieve list ALL user events (for DEBUG):
app.get('/events', async (req, res) => {
    const allEvents = [];
    const allEventRefs = await events.get();
    
    console.log(allEventRefs);

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    res.status(200);
    res.json(allEvents);
});

// retrieve events on specific users (for DEBUG)
app.get('/events/:uid', async (req, res) => {
    const uid = req.params.uid;
    const dayOfWeek = req.body.eventDay;
    const allEventRefs = await events.where('uid', '==', uid).get();
    const allEvents = [];    

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    res.status(200);
    res.json(allEvents);
});

// retrieve events of spec user on spec day
app.get('/events/:uid/:eventDay', async (req, res) => {
    const uid = req.params.uid;
    const dayOfWeek = req.params.eventDay;
    const allEventRefs = await events.where('eventDay', '==', dayOfWeek).where('uid', '==', uid).get();
    const allEvents = [];

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    res.status(200);
    res.json(allEvents);
});

// app.get('/:username/events/:day/search', async (req, res) => {
//     const username = req.params.username;
//     const dayOfWeek = req.params.day;
//     const fieldName = req.body.fieldname;
//     const fieldValue = req.body.fieldvalue;
//     const events = users.doc(username).collection('events');
//     const allEventRefs = await events.where('day', '==', dayOfWeek).where(fieldName, '==', fieldValue).get();
//     const allEvents = [];

//     allEventRefs.forEach(doc => {
//         allEvents.push(doc.data());
//     });

//     res.status(200);
//     res.json(allEvents);
// });

/* POST REQUESTS */

// create a new user
// app.post('/users', async (req, res) => {  
//     const username = req.body.username;
//     const checkUserExists = await users.doc(username).get();
//     if (checkUserExists.exists) {
//         res.status(400);
//         res.json({ message : "User already exists, try a different username" });
//     }
//     else {
//         const newUser = {
//            username: req.body.username,
//            password: req.body.password,
//         }
//         await users.doc(username).set(newUser);

//         res.status(201);
//         res.json({ message : "New user created" });
//     }
// });

// create a new event
app.post('/events', async (req, res) => {  

    const newEvent = {
        uid: req.body.uid, 
        eventName: req.body.eventName,
        eventTime: req.body.eventTime,
        eventDay: req.body.eventDay,
        eventDate: req.body.eventDate
    };
    await events.doc().set(newEvent);

    res.status(201);
    res.json({ message: 'Event created' });

});


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

