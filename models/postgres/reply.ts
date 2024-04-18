import {
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { DataTypes } from "sequelize";
import Topic from "./topic";
import User from "./user";
import UserUpvoteReply from "./userUpvoteReply";
import UserDownvoteReply from "./userDownvoteReply";
import Comment from "./comment";

@Table({
  tableName: "replies",
  underscored: true,
  modelName: "Reply",
})
export default class Reply extends Model {
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  })
  declare _id: string;

  @ForeignKey(() => Topic)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare topicId: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  declare author: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: false,
  })
  declare content: string;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  declare upvotes: number;

  @BelongsToMany(() => User, () => UserUpvoteReply)
  declare upvotees: User[];

  @BelongsToMany(() => User, () => UserDownvoteReply)
  declare downvotees: User[];

  @HasMany(() => Comment)
  declare comments: Comment[];
}
