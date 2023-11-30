/* eslint-disable no-undef */
const express = require('express');
const http = require('http');
const auth = require('json-server-auth');
const jsonServer = require('json-server');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const router = jsonServer.router('db.json');

router.render = (req, res) => {
   if (
      req.path.includes('/conversations') &&
      (req.method === 'POST' || req.method === 'PATCH')
   ) {
      io.emit('conversations', res.locals.data);
   } else if (req.path.includes('/messages') && req.method === 'POST') {
      io.emit('messages', res.locals.data);
   }
   res.json(res.locals.data);
};

const middlewares = jsonServer.defaults();

// Bind the router db to the app
app.db = router.db;

app.use(middlewares);

const rules = auth.rewriter({
   users: 640,
   conversations: 660,
   messages: 660,
});

app.use(rules);
app.use(auth);
app.use(router);

server.listen(9000);
