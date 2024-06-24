module.exports = {
    create: require('./userControllers').createUser,
    update: require('./userControllers').updateUserDetails,
    getAll: require('./userControllers').getAllUser,
    userById: require('./userControllers').getUserByID,
    deleteUser: require('./userControllers').deleteUser,
    login: require('./loginController').login
}