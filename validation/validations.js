const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateForecastInput(data) {
  try {
    let errors = {};
    data.item_id = !isEmpty(data.item_id) ? data.item_id : "";
    data.year = !isEmpty(data.year) ? data.year : "";

    // Name checks
    if (Validator.isEmpty(data.item_id.toString())) {
      errors.item_id = "Item field is required";
    }
    if (Validator.isEmpty(data.year.toString())) {
      errors.year = "Year field is required";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  } catch (ex) {
    console.log(ex);
    return {
      isValid: false
    };
  }
};
