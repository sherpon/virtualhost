require('dotenv').config({ 
  path: process.env.DOTENV_PATH,
});

/**
 * https://www.npmjs.com/package/dotenv
 * try with this code why doesn't read the dotenv file
 * const result = dotenv.config()
 
   if (result.error) {
     throw result.error
   }
    
   console.log(result.parsed)
 */

console.log('DOTENV_PATH');
console.log(process.env.DOTENV_PATH);

const express = require('express');
const vhost = require('vhost');
const fs = require("fs");
const fsPromises = fs.promises;
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
const domainManagerRouter = require('./domainManager');
const virtualhostServerRouter = require('./virtualhostServer');

app.use(vhost(process.env.CREATOR_ENDPOINT, websiteCreatorRouter));

app.use(vhost(process.env.PUBLISHER_ENDPOINT, publisherRouter));

app.use(vhost(process.env.DOMAIN_MANAGER_ENDPOINT, domainManagerRouter));

const allDomainRegex = /[a-z]/ig;
app.use( async (req, res, next) => {
  /**
   * TO-DO 
   * req.hostname returns undefined when is running as docker stack in the staging server
   */
  const domain = req.hostname;
  const result = allDomainRegex.test(domain);
  if (!result) {
    next();
  }
  console.log('DOMAIN');
  console.log(domain);

  console.log('PUBLIC_DIRECTORY DOMAIN');
  console.log(`${process.env.PUBLIC_DIRECTORY}/${domain}`);

  if (fs.existsSync(`${process.env.PUBLIC_DIRECTORY}/${domain}`)) {
    let config = await fsPromises.readFile(`${process.env.PUBLIC_DIRECTORY}/${domain}/config.json`, { encoding: 'utf8' });
    config = JSON.parse(config);
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
  const port = process.env.DEV_PORT || 7000;
  app.listen(port, function () {
    console.log('NODE_ENV: %s', process.env.NODE_ENV);
    console.log('Sherpon Virtualhost running on http://*.localhost:%d/', port);
  });
}

// Instead do export the app:
module.exports = app;