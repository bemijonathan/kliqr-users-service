const { response, log } = require("./utils")

const authmiddleWare = async (req, res, next) => {
    try {
        const token = req.headers.token
        if (!token) {
            return response(res, 400, false, null, "missing api key")
        }
        const buff = new Buffer(token, 'base64');
        base64token = await buff.toString('ascii')

        if (base64token !== process.env.auth_token) {
            return response(res, 400, false, null, "invalid Api Key ")
        }
        next()
    } catch (error) {
        log(error)
        return response(res, 500, false, null, "server Error" )
    }

}

module.exports = authmiddleWare