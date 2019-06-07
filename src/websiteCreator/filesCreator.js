const fsPromises = require('fs').promises;

const templateIndex = require('./sources/templateIndex');
const templatePages = require('./sources/templatePages');
const templateHeader = require('./sources/templateHeader');
const templateFooter = require('./sources/templateFooter');

const pageAbout = require('./sources/pageAbout');

const filesCreator = (configFile) => {
  return new Promise( async (resolve, reject) => {
    
    try {
      /** CREATE DIRECTORIES */
      // create Website Directory
      await fsPromises.mkdir(`${process.env.PUBLIC_DIRECTORY}/${configFile.domain}`);
      // create Website Templates Directory
      await fsPromises.mkdir(`${process.env.PUBLIC_DIRECTORY}/${configFile.domain}/templates`);
      // create Website Pages Directory
      await fsPromises.mkdir(`${process.env.PUBLIC_DIRECTORY}/${configFile.domain}/pages`);

      /** CREATE TEMPLATES */
      // create Website Index Template
      await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${configFile.domain}/templates/index.ejs`, templateIndex);
      // create Website pages Template
      await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${configFile.domain}/templates/pages.ejs`, templatePages);
      // create Website header Template
      await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${configFile.domain}/templates/header.ejs`, templateHeader);
      // create Website footer Template
      await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${configFile.domain}/templates/footer.ejs`, templateFooter);

      /** CREATE PAGES */
      // create Website about Page
      await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${configFile.domain}/pages/about.ejs`, pageAbout);
      // create Website about json
      await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${configFile.domain}/pages/about.json`, JSON.stringify({
        "type": "page",
        "filename": "about.ejs",
        "createdAt": new Date(),
        "url":"about",
        "keywords":"",
        "title":"About page",
        "description":"",
        "meta":"",
        "scripts":"",
        "styles":"",
      }));

      /** CREATE CONFIG FILE */
      await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${configFile.domain}/config.json`, JSON.stringify(configFile));

      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

module.exports = filesCreator;