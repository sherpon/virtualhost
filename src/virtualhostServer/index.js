const  express = require('express');
const  bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.text());
router.use(bodyParser.json({type: 'application/json'}));

router.post('/', function (request, response) { 
  response.send('virtualhostServer');
})

module.exports = router;