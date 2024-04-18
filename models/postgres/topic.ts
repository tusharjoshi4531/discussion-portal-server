import { DataTypes, HasManyGetAssociationsMixin } from "sequelize";
import { ITopicData } from "../../types/discussion";
import { ID } from "../../types/util";
import Postgres from "../../db/postgres";
import Tags from "./tag";
import {
  Column,
  Table,
  Model,
  ForeignKey,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import User from "./user";
import UserStarTopic from "./userStarTopic";
import Reply from "./reply";

@Table({
  tableName: "topics",
  underscored: true,
  modelName: "Topic",
})
export default class Topic
  extends Model
  implements ID<Omit<ITopicData, "tags">>
{
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  })
  declare _id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare authorId: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  declare author: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: false,
  })
  declare description: string;

  @HasMany(() => Tags)
  declare tags: Tags[];
  declare getTags: HasManyGetAssociationsMixin<Tags>;

  @HasMany(() => Reply)
  declare replies: Reply[];

  @BelongsToMany(() => User, () => UserStarTopic)
  declare starredBy: User[];
}
