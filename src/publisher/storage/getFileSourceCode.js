/**
 * reference https://cloud.google.com/nodejs/docs/reference/storage/2.5.x/File#download
 */

const getFileSourceCode = async (storage, websiteId, file) => {

  let options = {};

  if (file.type==='page') {
    const newPageJson = `${file.url}.json`;
    await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${websiteId}/pages/${newPageJson}`, JSON.stringify(file));
    options = {
      // The path to which the file should be downloaded, e.g. "./file.txt"
      destination: `${process.env.PUBLIC_DIRECTORY}/${websiteId}/${file.type}s/${file.url}.ejs`,
    };
  } else {
    // template 
    options = {
      // The path to which the file should be downloaded, e.g. "./file.txt"
      destination: `${process.env.PUBLIC_DIRECTORY}/${websiteId}/${file.type}s/${file.filename}`,
    };
  }
  
  // Downloads the file
  return storage
    .bucket(process.env.GOOGLE_STORAGE_BUCKET)
    .file(`${websiteId}/${file.type}s/${file.filename}`)
    .download(options);
};

module.exports = getFileSourceCode;