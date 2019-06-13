/**
 * reference https://cloud.google.com/nodejs/docs/reference/storage/2.5.x/File#download
 */

const getFileSourceCode = (storage, websiteId, file) => {

  if (file.type==='page') {
    const newFilenameJson = file.filename.replace('.ejs', '.json');
    await fsPromises.writeFile(`${process.env.PUBLIC_DIRECTORY}/${websiteId}/pages/${newFilenameJson}`, JSON.stringify(file));
  }

  const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: `${process.env.PUBLIC_DIRECTORY}/${websiteId}/${file.type}/${file.filename}`,
  };
  
  // Downloads the file
  return storage
    .bucket(process.env.GOOGLE_STORAGE_BUCKET)
    .file(`${websiteId}/${file.type}/${file.id}`)
    .download(options);
};

module.exports = getFileSourceCode;