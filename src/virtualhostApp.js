require('dotenv').config({ 
  path: process.env.DOTENV_PATH,
});

const express = require('express');
const vhost = require('vhost');
const fs = require("fs");
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
app.set('views', process.env.PUBLIC_DIRECTORY);

const websiteCreatorRouter = require('./websiteCreator');
const publisherRouter = require('./publisher');
const virtualhostServerRouter = require('./virtualhostServer');

app.use(vhost(process.env.WEBSITE_CREATOR_ENDPOINT, websiteCreatorRouter));

app.use(vhost(process.env.PUBLISHER_ENDPOINT, publisherRouter));

const allDomainRegex = /[a-z]/ig;
app.use((req, res, next) => {
  const domain = req.hostname;
  const result = allDomainRegex.test(domain);
  if (!result) {
    next();
  }
  if (fs.existsSync(`${process.env.PUBLIC_DIRECTORY}/${domain}`)) {
    const config = require(`${process.env.PUBLIC_DIRECTORY}/${domain}/config.json`);
    // populate
    req.websiteConfig = config;
    virtualhostServerRouter(req, res, next);
  } else {
    next();
  }
});

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

// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) { 
  //Start Sherpon Virtualhost
  const port = process.env.PORT || 7000;
  app.listen(port, function () {
    console.log('NODE_ENV: %s', process.env.NODE_ENV);
    console.log('Sherpon Virtualhost running on http://*.localhost:%d/', port);
  });
}

// Instead do export the app:
module.exports = app;