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

  @BelongsToMany(() => User, () => UserStarTopic)
  declare starredBy: User[];

  
}

// const sequelize = Postgres.Instance.Client;

// class TopicModel extends Model implements ID<Omit<ITopicData, "tags">> {
//   declare _id: string;
//   declare authorId: string;
//   declare author: string;
//   declare title: string;
//   declare description: string;
// }

// TopicModel.init(
//   {
//     _id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     authorId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },
//     author: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: "topic",
//     timestamps: false,
//     underscored: true,
//     tableName: "topics",
//   }
// );

// TopicModel.hasMany(Tags, { foreignKey: "topicId" });

// export default TopicModel;
