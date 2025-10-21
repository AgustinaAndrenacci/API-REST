exports.showErrorMessage = (httpErrorCode, message) => {
  const imageUrl = `https://http.cat/images/${code}.jpg`;
  const errorPayload = {
    status: code,
    message: String(message),
    imageUrl
  };
  console.log("{message}", errorPayload);
}

module.exports = { showErrorMessage };