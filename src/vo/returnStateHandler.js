const { ErrorResponse } = require('../vo/ErrorResponse');

const removeEmptyValueFromObject = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
}

module.exports.returnStateHandler = async function (returnState,req, res, next) {
  try {
    const success = returnState.success;
    if (success) {
      const body = removeEmptyValueFromObject(returnState);
      return res.status(200).send(body);
    } else {
     return res.status(returnState.status).send(returnState);
    }
   } catch (error) {
    console.log('Caught error. Sending error also now',error);
    //res.status(500).send(error);
    const data = {
        requestId: req.requestId,
        responseCode: res.statusCode,
        url : `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        errorInfo: error.errorInfo
    }
    const errResponse = new ErrorResponse(500, 'Interval Server Error',false);
    throw errResponse;
    // next();
   }
};
