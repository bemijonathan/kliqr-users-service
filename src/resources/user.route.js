const { Router } = require("express");
const { checkSchema } = require("express-validator");
const { userValidationSchema } = require("../validation");
const { getOne, getAll, deleteOne, createOne, updateOne ,getExpenseTrends} = require('./user.controller');

const userRoutes = Router()

userRoutes.route('/')
    .get(getAll)
    .post(checkSchema(userValidationSchema), createOne)


userRoutes.route('/expense-trends/:id')
    .get(getExpenseTrends);

userRoutes.route('/:id')
    .get(getOne)
    .delete(deleteOne)
    .patch( checkSchema(userValidationSchema), updateOne)

module.exports = userRoutes