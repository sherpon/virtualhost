const  express = require('express');
const  bodyParser = require('body-parser');

const expirationFilter = require('./expirationFilter');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.text());
router.use(bodyParser.json({type: 'application/json'}));

router.use(expirationFilter());

router.use(express.static(process.env.STATICS_DIRECTORY));

router.get('/:pageUrl', function (request, response) { 
  const domain = request.hostname;
  const config = request.websiteConfig;
  const pageUrl = request.params.pageUrl;
  const pageConfig = require(`${process.env.PUBLIC_DIRECTORY}/${domain}/pages/${pageUrl}.json`);

  response.render(`${domain}/templates/pages`, {
    domain,
    config,
    pageUrl,
    pageConfig,
  });
});

router.get('/', function (request, response) { 
  const domain = request.hostname;
  const config = request.websiteConfig;
  response.render(`${domain}/templates/index`, {
    domain,
    config,
  });
});

module.exports = router;