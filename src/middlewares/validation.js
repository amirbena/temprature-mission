const { StatusCodes } = require('http-status-codes')


const sendFailedData = (res, message) => res.status(StatusCodes.BAD_REQUEST).send(`Something in input is wrong, please correct ${message}`);


const validateUserInput = (req, res, next) => {

    if (!req.body) return sendFailedData(res, "body, it's empty");
    const { userName, password } = req.body;
    if (typeof userName !== "string" && typeof password !== "string") return sendFailedData(res, "password or userName to string type")
    next();
}

const validateDateCitySearch = (req, res, next) => {

    if (!req.params) return sendFailedData(res, "params, it's empty");
    const { city, date } = req.params;
    
    if (typeof city !== "string" && typeof date !== "string") return sendFailedData(res, "city or date to string type");
    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4}$/
    if (date.search(dateRegex) === -1) return sendFailedData(res, "Date suppose be in format: DD.MM.YYYY");
    const splittedDate = date.split(".");
    const newDate = new Date(parseInt(splittedDate[2]), parseInt(splittedDate[1])-1, parseInt(splittedDate[0]));
    req.body = { date: newDate };
    next();
}

const validateChangeTypeCity = (req, res, next) => {
    if (!req.body) return sendFailedData(res, "body, it's empty");
    const { type, city } = req.body;
    if (typeof city !== "string" && typeof type !== "string") return sendFailedData(res, "type or date to string type");
    if (type !== "enable" && type !== "disable") return sendFailedData(res, "type can be: enable or disable");
    next();
}

module.exports = {
    validateUserInput,
    validateDateCitySearch,
    validateChangeTypeCity
}