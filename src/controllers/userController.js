const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { UserRepository } = require('../../database');

const createToken = async user => {
    const { userName } = user;
    const tokenPayload = { userName };
    const token = await jwt.sign(tokenPayload, process.env.TOKEN_KEY);
    return token;
}

const signup = async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await UserRepository.signup(userName, password)
        if (user === "existed") return res.status(StatusCodes.CONFLICT).send("User name is exists, please change username");
        const token = await createToken(user);
        res.setHeader("Authorization", token);
        res.send("User is signed up successfully");
    } catch (ex) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Internal Error, reason: ${ex.message}`);
    }
}

const signIn = async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await UserRepository.signup(userName, password)
        if (user === "not existed") return res.status(StatusCodes.NOT_FOUND).send("User name is not exists");
        if (user === "Not same") return res.status(StatusCodes.CONFLICT).send("Password is not same, please change passwords");
        const token = await createToken(user);
        res.setHeader("Authorization", token);
        res.status(StatusCodes.OK).send("User is signed up successfully");
    } catch (ex) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Internal Error, reason: ${ex.message}`);
    }
}



module.exports = {
    signup,
    signIn
}


