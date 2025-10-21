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

/*function showErrorMessage (httpErrorCode, message){
  console.log(httpErrorCode, message);
  res.status(httpErrorCode).json({ error: message });
  const imageUrl = `https://http.cat/${code}.jpg`;
  const errorPayload = {
    status: httpErrorCode,
    message: String(message),
    imageUrl
  };
  console.log("Json con el error (para el front)", errorPayload);
}; */

const showErrorMessage = (res, httpErrorCode, message) => {
  const imageUrl = `https://http.cat/${httpErrorCode}.jpg`;
  const payload = {
    status: httpErrorCode,
    message: String(message),
    imageUrl
  };
  console.log("[errorHandler]", payload);
  return res.status(httpErrorCode).json(payload); /* Esta linea va a modificarse con el front, capaz */
};

module.exports = { showErrorMessage };