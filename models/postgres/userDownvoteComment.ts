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
import Comment from "./comment";
import UserUpvoteComment from "./UserUpvoteComment";

@Table({
  tableName: "user_downvote_comment",
  underscored: true,
  modelName: "UserDownvoteComment",
})
export default class UserDownvoteComment extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare userId: string;

  @ForeignKey(() => Comment)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare commentId: string;

  @AfterCreate
  static async decrementUpvote(instance: UserDownvoteComment) {
    const deletedInstances = await UserUpvoteComment.destroy({
      where: {
        userId: instance.userId,
        commentId: instance.commentId,
      },
    });

    const decrementBy = deletedInstances > 0 ? 2 : 1;

    await Comment.decrement("upvotes", {
      by: decrementBy,
      where: {
        id: instance.commentId,
      },
    });
  }

  @BeforeCreate
  static async checkIfDownvoted(instance: UserDownvoteComment) {
    const downvote = await UserDownvoteComment.findOne({
      where: {
        userId: instance.userId,
        commentId: instance.commentId,
      },
      attributes: ["comment_id"]
    });

    if (downvote) {
      throw new Error("Already downvoted");
    }
  }
}
