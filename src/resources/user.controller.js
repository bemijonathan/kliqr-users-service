const UserService = require("./user.service");

const user_service = new UserService()

module.exports.getOne = async (req, res) => {
    return user_service.getOneUser(req, res);
}

module.exports.getAll = async (req, res) => {
    return user_service.getUsers(req, res);
}

module.exports.createOne = async (req, res) => {
    return user_service.createUser(req, res);
}

module.exports.deleteOne = async (req, res) => {
    return user_service.deleteUser(req, res);
}

module.exports.updateOne = async (req, res) => {
    return user_service.updateUser(req, res);
}