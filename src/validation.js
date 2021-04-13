module.exports.userValidationSchema = {
    first_name: {
        notEmpty: true,
        withMessage: "First Name is required!"
    },
    last_name: {
        notEmpty: true,
        withMessage: "Last Name is required!"
    },
    avatar: {
        notEmpty: true,
        withMessage: "Avatar is required!"
    }
}