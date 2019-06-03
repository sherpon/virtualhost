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

// ********************************************
// API
// ********************************************
app.use('/users', require(path.join(__dirname, 'api/users')) );
app.use('/sites', require(path.join(__dirname, 'api/sites')) );
const websiteCreatorRouter = require('./websiteCreator');
const virtualhostServerRouter = require('./virtualhostServer');

app.use(vhost(process.env.WEBSITE_CREATOR_ENDPOINT,  websiteCreatorRouter ));

console.log('DOTENV_PATH');
console.log(process.env.DOTENV_PATH);

console.log('WEBSITE_CREATOR_ENDPOINT');
console.log(process.env.WEBSITE_CREATOR_ENDPOINT);