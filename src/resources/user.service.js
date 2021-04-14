const { query } = require("../db");
const { response, log } = require("../utils");
const { validationResult } = require("express-validator");
const moment = require("moment");

class UserService {
	async getUsers(req, res) {
		try {
			const data = await query(`
                SELECT
                    u.id,
                    u.first_name ,
                    u.last_name ,
                    count(t.id) transaction,
                    u.created_at
                from
                    Users u
                join Transactions t on
                    u.id = t.userId
                group by
                    u.id;
            `);

			const firstDetail = await query(`
                SELECT
                    t.category, t.amount, t.id, t.type
                FROM
                    Users u
                join Transactions t on
                    u.id = t.userId
                where
                    u.id = ${data[0].id}
            `);

			return response(
				res,
				200,
				true,
				{
					data,
					details: firstDetail,
					user: data[0],
				},
				"success"
			);
		} catch (error) {
			log(error);
			return response(res, 500, false, {}, "server Error");
		}
	}

	async getExpenseTrends(req, res) {
		const id = req.params.id;
		if (!id) {
			return response(res, 400, false, {}, "id is required");
		}
		const user = await query(`select * from Users where id = ${id}`);
		if (!user) {
			return response(res, 404, false, {}, "user not found");
		}
		const OneYeardata = await query(`select t.category , MONTHNAME(t.date_time) as month
        from Transactions t 
        where t.date_time >= DATE_SUB(NOW(),INTERVAL 1 YEAR) and userId  = ${id};`);
		let offset = 12;
		let months = [];
		while (offset > 0) {
			months.push(
				moment()
					.add(offset--, "month")
					.format("MMMM")
			);
		}
		const twelveMonthsData = JSON.parse(
			JSON.stringify(
				Array(12).fill({
					gift: 0,
					food: 0,
					transportation: 0,
					housing: 0,
				})
			)
		);
		OneYeardata.forEach((e, i) => {
			let x = 0;
			months.forEach((f, j) => {
				if (e.month.toLowerCase() === f.toLowerCase()) {
					x = j;
					return;
				}
			});
			if (e.category === "gift") {
				twelveMonthsData[x].gift++;
			} else if (e.category === "food") {
				twelveMonthsData[x].food++;
			} else if (e.category === "housing") {
				twelveMonthsData[x].housing++;
			} else if (e.category === "transportation") {
				twelveMonthsData[x].transportation++;
			}
		});
		let result = {};
		Object.keys(twelveMonthsData[0]).forEach((d) => {
			result[d] = {
				times: 0,
				total: 0,
			};
		});
		twelveMonthsData.forEach((e) => {
			if (e.gift > 0) {
				result.gift.times++;
				result.gift.total += e.gift;
			}
			if (e.food > 0) {
				result.food.times++;
				result.food.total += e.food;
			}
			if (e.housing > 0) {
				result.housing.times++;
				result.housing.total += e.housing;
			}
			if (e.transportation > 0) {
				result.transportation.times++;
				result.transportation.total += e.transportation;
			}
		});
		const final = Object.keys(result).filter((g) => {
			if (result[g].times >= 7) {
				return g;
			}
		});
		return response(res, 200, true, final, "success");
	}

	async getOneUser(req, res) {
		try {
			const id = req.params.id;

			const data = await query(`SELECT * FROM Users WHERE id = ${id}`);

			if (data.length === 0) {
				return response(res, 404, false, null, "not found");
			}

			const firstDetail = await query(`
                SELECT
                    t.category, t.amount, t.id, t.type
                FROM
                    Users u
                join Transactions t on
                    u.id = t.userId
                where
                    u.id = ${data[0].id}
            `);

			return response(
				res,
				200,
				true,
				{ details: firstDetail, user: data[0] },
				"success"
			);
		} catch (error) {
			log(error);
			return response(res, 500, false, {}, "server Error");
		}
	}

	async createUser(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return response(res, 400, false, errors.array(), "failed validation");
		}
		try {
			const { first_name, last_name, avatar } = req.body;
			const querydata = `
                INSERT INTO Users (first_name ,last_name, avatar) 
                VALUES ('${first_name}', '${last_name}', '${avatar}');
            `;
			const data = await query(querydata);
			return response(
				res,
				200,
				true,
				{ first_name, last_name, avatar, id: data.insertId },
				"success"
			);
		} catch (err) {
			log(err);
			return response(res, 500, false, {}, "server Error");
		}
	}

	async updateUser(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return response(res, 400, false, errors.array(), "failed validation");
		}
		try {
			const { first_name, last_name, avatar } = req.body;

			const id = req.params.id;
			const getData = await query(`SELECT * FROM Users WHERE id = ${id}`);
			if (getData.length === 0) {
				return response(res, 404, false, null, "not found");
			}
			const querydata = `
                UPDATE Users 
                SET 
                    first_name = '${first_name}', 
                    last_name = '${last_name}', 
                    avatar = '${avatar}'
                WHERE id = ${id}
            `;
			const data = await query(querydata);
			return response(
				res,
				200,
				true,
				{ first_name, last_name, avatar, id },
				"success"
			);
		} catch (err) {
			log(err);
			return response(res, 500, false, {}, "server Error");
		}
	}

	async deleteUser(req, res) {
		try {
			const id = req.params.id;
			const getData = await query(`SELECT * FROM Users WHERE id = ${id}`);
			if (getData.length === 0) {
				return response(res, 404, false, null, "not found");
			}
			const querydata = `
                DELETE FROM Users 
                WHERE id = ${id};
            `;
			let c = await query(querydata);
			log(JSON.stringify(c));
			return response(res, 200, true, {}, "success");
		} catch (err) {
			log(err);
			return response(res, 500, false, {}, "server Error");
		}
	}
}

module.exports = UserService;
