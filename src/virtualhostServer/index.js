const  express = require('express');
const  bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.text());
router.use(bodyParser.json({type: 'application/json'}));

router.get('/:pageName', function (request, response) { 
  const domain = request.hostname;
  const pageName = request.params.pageName;
  // response.send('virtualhostServer');
  response.render(`${domain}/templates/pages`, {
    domain,
    pageName,
  });
});

router.get('/', function (request, response) { 
  const domain = request.host;
  // response.send('virtualhostServer');
  response.render(`${domain}/templates/index`, {
    domain,
  });
});

module.exports = router;