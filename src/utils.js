const chalk = require("chalk")

const response = (res, statusCode, status, data, message) => {

    const jsonData = {
        status,
        statusCode,
        data,
        message
    }

    delete jsonData.statusCode

    return res.status(statusCode).send(jsonData)
}


const log = (data) => {
    console.log(chalk.greenBright(data))
}


module.exports = {
    response,
    log
}