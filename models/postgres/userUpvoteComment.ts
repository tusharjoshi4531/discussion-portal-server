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
import UserDownvoteComment from "./userDownvoteComment";

@Table({
  tableName: "user_upvote_comment",
  underscored: true,
  modelName: "UserUpvoteComment",
})
export default class UserUpvoteComment extends Model {
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

  @ForeignKey(() => Comment)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare commentId: string;

  @AfterCreate
  static async incrementUpvote(instance: UserUpvoteComment) {
    const deletedInstances = await UserDownvoteComment.destroy({
      where: {
        userId: instance.userId,
        commentId: instance.commentId,
      },
    });

    const incrementBy = deletedInstances > 0 ? 2 : 1;

    await Comment.increment("upvotes", {
      by: incrementBy,
      where: { _id: instance.commentId },
    });
  }

  @BeforeCreate
  static async checkIfUpvoted(instance: UserUpvoteComment) {
    console.log("CHECK");
    console.log(instance.toJSON());
    const upvote = await UserUpvoteComment.findOne({
      where: {
        userId: instance.userId,
        commentId: instance.commentId,
      },
      attributes: ["comment_id"],
    });

    if (upvote) {
      throw new Error("Already upvoted");
    }
  }
}
