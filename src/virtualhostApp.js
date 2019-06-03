require('dotenv').config({ 
  path: process.env.DOTENV_PATH,
});

const express = require('express');
const vhost = require('vhost');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

//Create server
const app = express();

// secure middleware
app.use(helmet());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  // use morgan to log at command line
  app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// set ejs render
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

const websiteCreatorRouter = require('./websiteCreator');
const virtualhostServerRouter = require('./virtualhostServer');

app.use(vhost(process.env.WEBSITE_CREATOR_ENDPOINT, websiteCreatorRouter));
app.use(vhost(/[a-z]/ig, virtualhostServerRouter));

// ********************************************
// The 404 Route
// ********************************************
app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    // respond with html page
    res.type('txt').send('Sherpon virtualhost app ' + process.env.NODE_ENV + ': Not found');
  }
  else if (req.accepts('json')) {
    // respond with json
    res.send({ error: 'Sherpon virtualhost app ' + process.env.NODE_ENV + ': Not found' });
  } else {
    // default to plain-text. send()
    res.type('txt').send('Sherpon virtualhost app ' + process.env.NODE_ENV + ': Not found');
  }
})

// console.log('DOTENV_PATH');
// console.log(process.env.DOTENV_PATH);

// console.log('WEBSITE_CREATOR_ENDPOINT');
// console.log(process.env.WEBSITE_CREATOR_ENDPOINT);

// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) { 
  //Start Sherpon Virtualhost
  var port = process.env.PORT || 7000
  app.listen(port, function () {
    console.log(colors.blue('NODE_ENV: %s'), process.env.NODE_ENV)
    console.log(colors.cyan('Sherpon Virtualhost running on http://*.localhost:%d/'), port)
  })
}

// Instead do export the app:
module.exports = app;