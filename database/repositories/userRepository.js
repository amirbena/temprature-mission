const UserModel = require('../models/userModel');



const signup = async (userName, password) => {
    let user = await UserModel.findOne({ userName }).exec();
    if (user) return "existed";
    user = await new UserModel({ userName, password }).save();
    return user;
}



const signIn = async (userName, password) => {
    let user = await UserModel.findOne({ userName }).exec();
    if (!user) return "not existed";
    if (user.password !== password) return "Not same";
    return user;
}


module.exports={
    signup,
    signIn
}