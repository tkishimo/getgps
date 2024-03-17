const { Pool } = require('pg');
require('dotenv').config(); // dotenvパッケージを読み込む

const connectionString = process.env.DATABASE_URL; // .envファイルからDATABASE_URLを取得する
const pool = new Pool({
    connectionString: connectionString,
    max: 2
});

module.exports = pool;