import {
  AfterCreate,
  BeforeCreate,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";
import { DataTypes } from "sequelize";
import Reply from "./reply";
import UserDownvoteReply from "./userDownvoteReply";

@Table({
  tableName: "user_upvote_reply",
  underscored: true,
  modelName: "UserUpvoteReply",
})
export default class UserUpvoteReply extends Model {
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
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
  static async incrementUpvote(instance: UserUpvoteReply) {
    const deletedInstances = await UserDownvoteReply.destroy({
      where: {
        userId: instance.userId,
        replyId: instance.replyId,
      },
    });

    const incrementBy = deletedInstances > 0 ? 2 : 1;

    await Reply.increment("upvotes", {
      by: incrementBy,
      where: { _id: instance.replyId },
    });
  }

  // @BeforeDestroy
  // static async decrementUpvote(instance: UserUpvoteReply) {
  //   console.log("DESTROY UPVOTE");
  //   // await Reply.decrement("upvotes", {
  //   //   by: 1,
  //   //   where: { _id: instance.replyId },
  //   // });
  // }

  @BeforeCreate
  static async checkIfUpvoted(instance: UserUpvoteReply) {
    console.log("CHECK");
    console.log(instance.toJSON());
    const upvote = await UserUpvoteReply.findOne({
      where: {
        userId: instance.userId,
        replyId: instance.replyId,
      },
      attributes: ["reply_id"],
    });

    if (upvote) {
      throw new Error("Already upvoted");
    }
  }
}
