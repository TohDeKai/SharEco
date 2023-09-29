module.exports = {
  AWS_GETFILE_URL:
    "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/",
};

/* 
upload image logic
 const fetchImageUri = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

const uploadImageFile = async (file) => {
  const img = await fetchImageUri(file.uri);
  return Storage.put(`${user.username}.jpeg`, img, {
    level: "public",
    contentType: file.type,
    progressCallback(uploadProgress) {
      console.log(
        "PROGRESS--",
        uploadProgress.loaded + "/" + uploadProgress.total
      );
    },
  })
    .then((res) => {
      Storage.get(res.key)
        .then((result) => {
          let awsImageUri = result.substring(0, result.indexOf("?"));
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
}; 
*/
