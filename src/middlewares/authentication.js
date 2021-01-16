const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken');


const sendBadRequestStatus = res => {
    return res.status(StatusCodes.BAD_REQUEST).send("No authenticated user, please log in");
}
const authentication = (req, res, next) => {

    const authorization = req.headers["authorization"];
    if (!authorization) return sendBadRequestStatus(res);
    const token = authorization.split(" ")[1];
    if (!token) return sendBadRequestStatus(res);
    const verifiedToken = jwt.decode(token);
    req.user = verifiedToken;
    next();
}

module.exports = authentication;

