const express = require('express');
const bodyParser = require('body-parser');
const fsPromises = require('fs').promises;

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.text());
router.use(bodyParser.json({type: 'application/json'}));

router.post('/', async function (request, response) { 
  const websiteId = request.body.websiteId;
  const newDomain = request.body.newDomain;
  const oldDomain = request.body.oldDomain;

  try {
    await fsPromises.unlink(`${process.env.PUBLIC_DIRECTORY}/${oldDomain}`);
    await fsPromises.symlink(`${process.env.SOURCES_DIRECTORY}/${websiteId}`, `${process.env.PUBLIC_DIRECTORY}/${newDomain}`);
    response.status(204);
  } catch (error) {
    console.error(error);
    response.status(401);
  } finally {
    response.end();
  }
})

module.exports = router;