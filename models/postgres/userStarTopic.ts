import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import User from "./user";
import { DataTypes } from "sequelize";
import Topic from "./topic";

@Table({
  tableName: "user_star_topic",
  underscored: true,
  modelName: "UserStarTopic",
})
export default class UserStarTopic extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare userId: string;

  @ForeignKey(() => Topic)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare topicId: string;
};
