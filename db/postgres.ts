import { Sequelize, SequelizeOptions } from "sequelize-typescript";


// Push it to env file
const pgConfig: SequelizeOptions = {
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Krmkmemah@4531",
  database: "discussion_portal",
  dialect: "postgres",
  models: [__dirname + "../models/postgres"],
  logging(sql, timing) {
    console.log(sql);
  },
};

export default class Postgres {
  private client: Sequelize;
  private static instance: Postgres;

  private constructor() {
    this.client = new Sequelize({
      host: pgConfig.host,
      port: pgConfig.port,
      username: pgConfig.username,
      password: pgConfig.password,
      database: pgConfig.database,
      dialect: pgConfig.dialect,
    });
  }

  public connect() {
    this.client
      .authenticate()
      .then(() => {
        console.log("Postgres connected");
      })
      .catch((err) => {
        console.log("Postgres connection failed", err);
      });
  }

  public get Client() {
    return this.client;
  }

  public static get Instance() {
    if (!this.instance) {
      this.instance = new Postgres();
    }
    return this.instance;
  }
}
