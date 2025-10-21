/* const showErrorMessage = (httpErrorCode, message) => {
  const imageUrl = `https://http.cat/images/${code}.jpg`;
  const errorPayload = {
    status: code,
    message: String(message),
    imageUrl
  };
  console.log("{message}", errorPayload);
}

module.exports = { showErrorMessage }; */

const showErrorMessage = (httpErrorCode = 500, message = "") => {
  const code = Number(httpErrorCode) || 500;
  const imageUrl = `https://http.cat/${code}.jpg`;
  const errorPayload = {
    status: code,
    message: String(message),
    imageUrl
  };
  console.log("[errorHandler]", errorPayload);
  return errorPayload;
};
// ...existing code...

module.exports = { showErrorMessage };