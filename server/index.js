require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const mc = require('./messagesCtrl')
app.use(express.json());

const { SERVER_PORT, SESSION_SECRET } = process.env;

app.use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 14
        } 
    }
));

app.use((req, res, next) => {
    let badWords = ['knucklehead', 'jerk', 'internet explorer'];
    if (req.body.message) {
      for (let i = 0; i < badWords.length; i++) {
        let regex = new RegExp(badWords[i], 'g');
        req.body.message = req.body.message.replace(regex, '****');
      }
      next();
    } else {
      next();
    }
  });

app.get('/api/messages', mc.getAllMessages);

app.post('/api/message', mc.createMessage);

app.get('/api/messages/history', mc.history);

const port = SERVER_PORT || 3005;
app.listen(port, () => console.log(`server listening on ${port}`))