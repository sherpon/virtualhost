const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

const filesCreator = require('./filesCreator');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.text());
router.use(bodyParser.json({type: 'application/json'}));

router.post('/', async function (request, response) { 
  // const user = request.body.user;
  // const website = request.body.website;

  const website = {
    domain: 'mydomain.localhost'
  };

  try {
    await filesCreator(website);
  } catch (error) {
    console.error(error);
  } finally {
    response.send('websiteCreator');
  }
})

module.exports = router;