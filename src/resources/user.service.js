const { query } = require("../db");
const { response, log } = require("../utils");
const { validationResult } = require("express-validator");

class UserService {
    async getUsers(req, res) {
        try {
            const data = await query(`SELECT * FROM Users`)
            return response(res, 200, true, data, 'success')
        } catch (error) {
            log(error)
            return response(res, 500, false, {}, 'server Error')
        }
    }

    async getOneUser(req, res) {
        try {
            const id = req.params.id
            const data = await query(`SELECT * FROM Users WHERE id = ${id}`)
            if (data.length === 0) {
                return response(res, 404, false, null, 'not found')
            }
            return response(res, 200, true, data[0], 'success')
        } catch (error) {
            log(error)
            return response(res, 500, false, {}, 'server Error')
        }
    }

    async createUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, 400, false, errors.array(), "failed validation")
        }
        try {
            const { first_name , last_name, avatar } = req.body;
            const querydata = `
                INSERT INTO Users (first_name ,last_name, avatar) 
                VALUES ('${first_name}', '${last_name}', '${avatar}');
            `
            const data = await query(querydata)
            return response(res, 200, true, { first_name, last_name , avatar, id: data.insertId }, 'success')
        } catch (err) {
            log(err)
            return response(res, 500, false, {}, 'server Error')
        }
    }

    async updateUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, 400, false, errors.array(), "failed validation")
        }
        try {
            const { first_name, last_name, avatar } = req.body;

            const id = req.params.id
            const getData = await query(`SELECT * FROM Users WHERE id = ${id}`)
            if (getData.length === 0) {
                return response(res, 404, false, null, 'not found')
            }
            const querydata = `
                UPDATE Users 
                SET 
                    first_name = '${first_name}', 
                    last_name = '${last_name}', 
                    avatar = '${avatar}'
                WHERE id = ${id}
            `
            const data = await query(querydata)
            return response(res, 200, true, { first_name, last_name, avatar, id }, 'success')
        } catch (err) {
            log(err)
            return response(res, 500, false, {}, 'server Error')
        }

    }

    async deleteUser(req, res) {
        try {
            const id = req.params.id
            const getData = await query(`SELECT * FROM Users WHERE id = ${id}`)
            if (getData.length === 0) {
                return response(res, 404, false, null, 'not found')
            }
            const querydata = `
                DELETE FROM Users 
                WHERE id = ${id};
            `
            let c = await query(querydata);
            log(JSON.stringify(c))
            return response(res, 200, true, {}, 'success')
        } catch (err) {
            log(err)
            return response(res, 500, false, {}, 'server Error')
        }
    }
}

module.exports = UserService