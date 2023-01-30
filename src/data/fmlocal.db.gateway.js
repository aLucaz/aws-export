import {MySqlDriver} from "./mysql.driver.js";

export class DatabaseGateway {
  static getInstance() {
    return new MySqlDriver(
      process.env.DB_HOST,
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD
    )
  }
}