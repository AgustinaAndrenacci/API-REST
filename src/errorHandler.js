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