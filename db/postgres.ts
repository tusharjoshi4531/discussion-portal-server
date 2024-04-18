import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import User from "../models/postgres/user";
import Tags from "../models/postgres/tag";
import Topic from "../models/postgres/topic";
import UserStarTopic from "../models/postgres/userStarTopic";
import UserUpvoteReply from "../models/postgres/userUpvoteReply";
import UserDownvoteReply from "../models/postgres/userDownvoteReply";
import Reply from "../models/postgres/reply";

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
      models: [
        User,
        Tags,
        Topic,
        UserStarTopic,
        UserUpvoteReply,
        UserDownvoteReply,
        Reply,
      ]
    });
  }

  public connect() {
    this.client
      .authenticate()
      .then(() => {
        console.log("Postgres connected");
        console.log("models: ", this.client.models);
        this.client.sync();
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