const dotEnv = require('dotenv')
dotEnv.config()

const app = require('./server')
const { InitConnection } = require('./src/db');


const port = process.env.PORT || 4500

app.listen(port , async () => {
    await InitConnection()
    console.log(' server has started');
})