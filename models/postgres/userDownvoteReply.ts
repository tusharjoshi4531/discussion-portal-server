import {
  AfterCreate,
  BeforeCreate,
  Column,
  ForeignKey,
  Index,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";
import { DataTypes } from "sequelize";
import Topic from "./topic";
import Reply from "./reply";
import UserUpvoteReply from "./userUpvoteReply";

@Table({
  tableName: "user_upvote_reply",
  underscored: true,
  modelName: "UserUpvoteReply",
})
export default class UserDownvoteReply extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare userId: string;

  @ForeignKey(() => Reply)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare replyId: string;

  @AfterCreate
  static async decrementDownvote(instance: UserDownvoteReply) {
    await Reply.decrement("upvotes", {
      by: 1,
      where: { _id: instance.replyId },
    });

    await UserUpvoteReply.destroy({
      where: {
        userId: instance.userId,
        replyId: instance.replyId,
      },
    });
  }

  @BeforeCreate
  static async checkIfDownvoted(instance: UserDownvoteReply) {
    const downvote = await UserDownvoteReply.findOne({
      where: {
        userId: instance.userId,
        replyId: instance.replyId,
      },
    });

    if (downvote) {
      throw new Error("Already downvoted");
    }
  }
}
