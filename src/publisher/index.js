const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions = {
  origin: process.env.ADMIN_APP_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.text());
router.use(bodyParser.json({type: 'application/json'}));

const getToken = require('./utilities/getToken');
const getAuthorization = require('./services/getAuthorization');
const getFirestore = require('./db/getFirestore');
const getFileAttributes = require('./db/getFileAttributes');
const getStorage = require('./storage/getStorage');
const getFileSourceCode = require('./storage/getFileSourceCode');

let firestore;
let storage;

const getFileSourceCodeStep = async (req, res) => {
  try {
    const websiteId = req.query.websiteId;
    const file = req.fileAttributes;
    storage = getStorage(storage);
    await getFileSourceCode(storage, websiteId, file);
    res.status(204);
    res.end();  // send no content
  } catch (error) {
    console.error('ERROR: getFileSourceCodeStep failed.');
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

const getFileAttributesStep = async (req, res) => {
  try {
    const websiteId = req.query.websiteId;
    const filename = req.body.filename;
    firestore = getFirestore(firestore);
    const file = await getFileAttributes(firestore, websiteId, filename);
    // populate
    req.fileAttributes = file;
    await getFileSourceCodeStep(req, res);
  } catch (error) {
    console.error('ERROR: getFileAttributesStep failed.');
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

const getAuthorizationStep = async (req, res) => {
  try {
    const userId = req.query.userId;
    const websiteId = req.query.websiteId;
    const token = req.userToken;
    const response = await getAuthorization(token, userId, websiteId);
    if (response.status===202) {
      // authorized
      await getFileAttributesStep(req, res);
    } else {
      // unauthorized
      console.error('ERROR: getAuthorizationStep failed.');
      console.log('the user ' + userId + ' is unauthorized');
      res.status(406);
      res.end();  // send no content
    }
  } catch (error) {
    console.error('ERROR: getAuthorizationStep failed.');
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

const getTokenStep = async (req, res) => {
  const myAuthentication = getToken(req.headers);
  if (myAuthentication===false) {
    // didn't find any token
    console.error('ERROR: getTokenStep failed.');
    res.status(401);
    res.end();  // send no content
  } else {
    // populate it
    req.userToken = myAuthentication.token;
    await getAuthorizationStep(req, res);
    // saveAttributesStep(req, res); /** IMPORTANT */
  }
};

router.options('/', cors(corsOptions))
router.post('/', cors(corsOptions), async function (request, response) { 
  // const domain = request.host;
  // response.send('virtualhostServer');
  /* response.render(`${domain}/templates/index`, {
    domain,
  }); */
  await getTokenStep(request, response);
});

module.exports = router;