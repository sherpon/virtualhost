
const getFileAttribute = (firestore, websiteId, filename) => {
  return new Promise((resolve, reject) => {
    const websiteRef = firestore.collection('websites').doc(websiteId);
    websiteRef.collection('files').doc(filename).get()
    .then(function(doc) {
      if (doc.exists) {
        // console.log("Document data:", doc.data());
        resolve({...doc.data(), createdAt: doc.data().createdAt._seconds * 1000, filename});
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