const getSuccessResponse = (payload, res) => {
  let responseObj = { isSuccess: true, payload }
  if (res) {
    return res.status(200).json(responseObj);
  }
  else {
    return responseObj;
  }
};


const getFailureResponse = (message, res) => {
  if (!message) {
    message = "Something went wrong.";
  }
  let responseObj = { isSuccess: false, message };
  if (res) {
    return res.status(200).json(responseObj);
  }
  else {
    return responseObj;
  }
};

module.exports = { getSuccessResponse, getFailureResponse };
