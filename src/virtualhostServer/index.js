const  express = require('express');
const  bodyParser = require('body-parser');
const fsPromises = require('fs').promises;

const expirationFilter = require('./expirationFilter');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.text());
router.use(bodyParser.json({type: 'application/json'}));

router.use(expirationFilter());

console.log('STATICS_DIRECTORY');
console.log(process.env.STATICS_DIRECTORY);

router.use(express.static(process.env.STATICS_DIRECTORY));

router.get('/:pageUrl', async function (request, response) { 
  const domain = request.hostname;
  const websiteConfig = request.websiteConfig;
  const pageUrl = request.params.pageUrl;
  let pageConfig = await fsPromises.readFile(`${process.env.PUBLIC_DIRECTORY}/${domain}/pages/${pageUrl}.json`, { encoding: 'utf8' });
  pageConfig = JSON.parse(pageConfig);
  response.render(`${domain}/templates/pages`, {
    domain,
    websiteConfig,
    pageUrl,
    pageConfig,
  });
});

router.get('/', async function (request, response) { 
  const domain = request.hostname;
  const websiteConfig = request.websiteConfig;
  let pageConfig = await fsPromises.readFile(`${process.env.PUBLIC_DIRECTORY}/${domain}/pages/home.json`, { encoding: 'utf8' });
  pageConfig = JSON.parse(pageConfig);
  response.render(`${domain}/templates/index`, {
    domain,
    websiteConfig,
    pageConfig,
  });
});

module.exports = router;