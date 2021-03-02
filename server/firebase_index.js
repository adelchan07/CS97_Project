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

// retrieve list of user calendars:
app.get('/:username/calendars', async (req, res) => {
    const username = req.params.username;
    const calendars = users.doc(username).collection('calendars');
    const allCalendars = [];
    const allCalendarRefs = await calendars.get();

    allCalendarRefs.forEach(doc => {
        allCalendars.push(doc.data());
    });

    res.status(200);
    res.json(allCalendars);
});

// retrieve events in specific calendar:
app.get('/:username/:calendars/events', async (req, res) => {
    const username = req.params.username;
    const calendarName = req.params.calendars;
    const calendars = users.doc(username).collection('calendars');
    const events = calendars.doc(calendarName).collection('events');
    const allEvents = [];
    const allEventRefs = await events.get();

    allEventRefs.forEach(doc => {
        allEvents.push(doc.data());
    });

    res.status(200);
    res.json(allEvents);
});

//retrieve all events in all calendars?
app.get('/:username/calendars/events', async (req, res) => {

});

// retrieve user to do list:
app.get('/:username/todo', async (req, res) => {
    const username = req.params.username;
    const todo = users.doc(username).collection('toDoList');
    const allToDos = [];
    const allToDoRefs = await todo.get();

    allToDoRefs.forEach(doc => {
        allToDos.push(doc.data());
    });

    res.status(200);
    res.json(allToDos);
});


/* POST REQUESTS */

// create a new user
app.post('/users', async (req, res) => {  
    const username = req.body.username      // id tag (can change later to random unique key)
    const newUser = {
        username: req.body.username,
        password: req.body.password,
    }
    await users.doc(username).set(newUser);

    res.status(201);
    res.json({ message: 'User created' });

});

// create a new event
app.post('/:username/:calendars/events', async (req, res) => {  
    const username = req.params.username
    const calendarName = req.params.calendars;
    const calendars = users.doc(username).collection('calendars');
    const events = calendars.doc(calendarName).collection('events');

    const eventName = req.body.eventName        // id tag (can change later to random unique key)
    const newEvent = {
        eventName: req.body.eventName,
        startDay: req.body.startDay,
        endDay: req.body.endDay,
        startHour: req.body.startHour,                      
        startMinute: req.body.startMinute,
        endHour: req.body.endHour,                        
        endMinute: req.body.endMinute,
        notificationMinute: req.body.notificationMinute,             
        location: req.body.location,
        description: req.body.description,
        color: req.body.color,
    }
    await events.doc(eventName).set(newEvent);

    res.status(201);
    res.json({ message: 'Event created' });

});

// create a new calendar (needs to create an event in calendar too)
app.post('/:username/calendars', async (req, res) => {  
    const username = req.params.username;
    const calendarName = req.body.calendarName;             // id tag (can change later to random unique key)
    const calendars = users.doc(username).collection('calendars');
    const newCalendar = {
        calendarName: req.body.calendarName,
    }
    await calendars.doc(calendarName).set(newCalendar);
    //await calendars.doc(calendarName).collection('events').doc();
    res.status(201);
    res.json({ message: 'Calendar created' });

});

// create a "to do" task
app.post('/:username/todo', async (req, res) => {  
    const username = req.params.username;
    const taskName = req.body.taskName;             // id tag (can change later to random unique key)
    const toDoList = users.doc(username).collection('toDoList');
    const newTask = {
        taskName: req.body.taskName,
        complete: false,
        description: req.body.description
    }
    await toDoList.doc(taskName).set(newTask);
    res.status(201);
    res.json({ message: 'Task created' });

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
app.listen(3000, () => {
    console.log('Server has started');
});

