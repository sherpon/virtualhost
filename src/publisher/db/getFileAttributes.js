
const getFileAttribute = (firestore, websiteId, fileId) => {
  return new Promise((resolve, reject) => {
    const websiteRef = firestore.collection('websites').doc(websiteId);
    websiteRef.collection('files').doc(fileId).get()
    .then(function(doc) {
      if (doc.exists) {
        // console.log("Document data:", doc.data());
        resolve({...doc.data(), id: fileId});
      } else {
        // doc.data() will be undefined in this case
        console.error("no such file!");
        reject();
      }
    }).catch(function(error) {
      // console.log("Error getting document:", error);
      reject(error);
    });
  });
};

module.exports = getFileAttribute;