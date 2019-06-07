const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

const filesCreator = require('./filesCreator');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.text());
router.use(bodyParser.json({type: 'application/json'}));

router.post('/', async function (request, response) { 
  const configFile = request.body;

  try {
    await filesCreator(configFile);
    response.status(201);
  } catch (error) {
    console.error(error);
    response.status(401);
  } finally {
    response.end();
  }
})

module.exports = router;