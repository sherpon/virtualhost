const fsPromises = require('fs').promises;

const templateIndex = require('./sources/templateIndex');
const templatePages = require('./sources/templatePages');
const templateHeader = require('./sources/templateHeader');
const templateFooter = require('./sources/templateFooter');

const pageHome = require('./sources/pageHome');
const pageAbout = require('./sources/pageAbout');

const filesCreator = (website) => {
  return new Promise( async (resolve, reject) => {
    /** CREATE DIRECTORIES */
    // create Website Directory
    await fsPromises.mkdir(`${process.env.PUBLIC_DIRECTORY}/${website.domain}`);
    // create Website Templates Directory
    await fsPromises.mkdir(`${process.env.PUBLIC_DIRECTORY}/${website.domain}/templates`);
    // create Website Pages Directory
    await fsPromises.mkdir(`${process.env.PUBLIC_DIRECTORY}/${website.domain}/pages`);

    /** CREATE TEMPLATES */
    // create Website Index Template
    await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${website.domain}/templates/index.ejs`, templateIndex);
    // create Website pages Template
    await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${website.domain}/templates/pages.ejs`, templatePages);
    // create Website header Template
    await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${website.domain}/templates/header.ejs`, templateHeader);
    // create Website footer Template
    await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${website.domain}/templates/footer.ejs`, templateFooter);

    /** CREATE PAGES */
    // create Website home Page
    await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${website.domain}/pages/home.ejs`, pageHome);
    // create Website about Page
    await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${website.domain}/pages/about.ejs`, pageAbout);

    resolve();
  });
};

module.exports = filesCreator;