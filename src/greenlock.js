'use strict';
const fs = require("fs");

//
// My Secure Server
//
var greenlock = require('greenlock-express').create({
  // Let's Encrypt v2 is ACME draft 11
  version: 'draft-11',
  // Let's Encrypt v2 is ACME draft 11
  // Note: If at first you don't succeed, stop and switch to staging
  // https://acme-staging-v02.api.letsencrypt.org/directory
  //server: 'https://acme-staging-v02.api.letsencrypt.org/directory',
  server: process.env.ACME_API, // 'https://acme-v02.api.letsencrypt.org/directory',
  version: 'draft-11',
  // You MUST have write access to save certs
  configDir: process.env.CERTIFICATES_DIRECTORY,

  // approveDomains is the right place to check a database for
  // email addresses with domains and agreements and such
  approveDomains: approveDomains,

  app: require('./virtualhostApp'),

  email: process.env.GREENLOCK_EMAIL,                                   // Email for Let's Encrypt account and Greenlock Security
  agreeTos: true,

  // Get notified of important updates and help me make greenlock better
  communityMember: false
  //, debug: true
});

var server = greenlock.listen(80, 443);
server.on('Greenlock stores-server listening', function () {
  console.info(server.type + " listening on", server.address());
});

const isDomainValid = (domain) => {
  const allDomainRegex = /[a-z]/ig;
  let isValid = false;

  if (allDomainRegex.test(domain)) {
    isValid = true;
  }

  return isValid;
};


const doesWebsiteExist = (domain) => {
  let doesExist = false;

  if (fs.existsSync(`${process.env.PUBLIC_DIRECTORY}/${domain}`)) {
    doesExist = true;
  }

  return doesExist;
};
//
// My Secure Database Check
//
function approveDomains(opts, certs, cb) {
  console.log('approveDomains');
  // Only one domain is listed with *automatic* registration via SNI
	// (it's an array because managed registration allows for multiple domains,
	//                                which was the case in the simple example)
  console.table(opts);
  console.table(certs);
  
  if (isDomainValid(opts.domains[0] !== true) /* the domain is not valid */) {
    cb(new Error("Domain not allowed"));
  }

  if (doesWebsiteExist(opts.domains[0] !== true) /* The website doesn't exist */) {
    cb(new Error("The website doesn't exist"));
  }

  // The domains being approved for the first time are listed in opts.domains
  // Certs being renewed are listed in certs.altnames
  if (certs) {
    console.log('The certs exist');
    opts.domains = [certs.subject].concat(certs.altnames);
    cb(null, { options: opts, certs: certs });
    return;
  }
  opts.agreeTos= true;
  opts.email= process.env.GREENLOCK_EMAIL;
  cb(null, { options: opts, certs: certs });
}
