import mysql from 'mysql';

export class MySqlDriver {
  constructor(host, database, user, password, port = 3306, connectionLimit = 4) {
    this._host = host;
    this._database = database;
    this._user = user;
    this._password = password;
    this._port = port;
    this._connectionLimit = connectionLimit;
  }

  createConnectionPool() {
    const connectionPool = mysql.createPool({
      connectionLimit: this._connectionLimit,
      host: this._host,
      port: this._port,
      user: this._user,
      password: this._password,
      database: this._database,
      timezone: '-05:00',
    });
    connectionPool.getConnection((err, connection) => {
      if (err)
        throw err;
      connection.release();
    });
    return connectionPool;
  }

  async execute(connection, query, values = {}) {
    return new Promise((resolve, reject) => {
      connection.query({sql: query, values, timeout: 15 * 1000}, (error, data) => {
        return resolve(data);
      });
    });
  }
}