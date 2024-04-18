import { DataTypes } from "sequelize";
import { IUserData } from "../../types/authentication";
import { ID } from "../../types/util";
import TopicModel from "./topic";
import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import UserStarTopic from "./userStarTopic";
import Reply from "./reply";
import UserUpvoteReply from "./userUpvoteReply";
import UserDownvoteReply from "./userDownvoteReply";
import UserUpvoteComment from "./UserUpvoteComment";
import UserDownvoteComment from "./userDownvoteComment";
import Comment from "./comment";

// const sequelize = Postgres.Instance.Client;

@Table({
  tableName: "users",
  underscored: true,
  modelName: "User",
})
export default class User extends Model implements ID<IUserData> {
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  })
  declare _id: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  declare username: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  declare password: string;

  @BelongsToMany(() => TopicModel, () => UserStarTopic)
  declare starredTopics: TopicModel[];

  @BelongsToMany(() => Reply, () => UserUpvoteReply)
  declare upvotedReplies: Reply[];

  @BelongsToMany(() => Reply, () => UserDownvoteReply)
  declare downvotedReplies: Reply[];

  @BelongsToMany(() => Comment, () => UserUpvoteComment)
  declare upvotedComments: Reply[];

  @BelongsToMany(() => Comment, () => UserDownvoteComment)
  declare downvotedComments: Reply[];
}

// class UserModel extends Model implements ID<IUserData> {
//   declare _id: string;
//   declare username: string;
//   declare password: string;
// }

// UserModel.init(
//   {
//     _id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: "user",
//     timestamps: false,
//     underscored: true,
//     tableName: "users",
//   }
// );

// UserModel.hasMany(TopicModel, { foreignKey: "authorId" });

// sequelize.sync({ force: true });

// export default UserModel;
