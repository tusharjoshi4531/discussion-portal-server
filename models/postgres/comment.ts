import { DataTypes } from "sequelize";
import {
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";
import UserUpvoteComment from "./UserUpvoteComment";
import UserDownvoteComment from "./userDownvoteComment";
import Reply from "./reply";

@Table({
  tableName: "comment",
  underscored: true,
  modelName: "Comment",
})
export default class Comment extends Model {
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
  declare author: string;

  @ForeignKey(() => Reply)
  @Column({
    type: DataTypes.UUID,
    allowNull: true,
  })
  declare replyId: string;

  @ForeignKey(() => Comment)
  @Column({
    type: DataTypes.UUID,
    allowNull: true,
  })
  declare parentId: string;

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

  @BelongsToMany(() => User, () => UserUpvoteComment)
  declare upvotees: User[];

  @BelongsToMany(() => User, () => UserDownvoteComment)
  declare downvotees: User[];

  @HasMany(() => Comment)
  declare children: Comment[];
}
