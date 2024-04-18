import {
  AfterCreate,
  AfterDestroy,
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
  tableName: "user_downvote_reply",
  underscored: true,
  modelName: "UserDownvoteReply",
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
  static async decrementUpvote(instance: UserDownvoteReply) {
    const deletedInstances = await UserUpvoteReply.destroy({
      where: {
        userId: instance.userId,
        replyId: instance.replyId,
      },
    });

    const decrementBy = deletedInstances > 0 ? 2 : 1;

    await Reply.decrement("upvotes", {
      by: decrementBy,
      where: {
        id: instance.replyId,
      },
    });
  }

  // @AfterDestroy
  // static async incrementUpvote(instance: UserDownvoteReply) {
  //   await Reply.increment("upvotes", {
  //     by: 1,
  //     where: {
  //       id: instance.replyId,
  //     },
  //   });
  // }

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
