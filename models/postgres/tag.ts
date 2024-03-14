import { DataTypes } from "sequelize";
import Postgres from "../../db/postgres";
import TopicModel from "./topic";
import { Table, Model, Column, ForeignKey } from "sequelize-typescript";

@Table({
  tableName: "tags",
  underscored: true,
  modelName: "Tag",
})
export default class Tags extends Model {
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
  declare tag: string;

  @ForeignKey(() => TopicModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  declare topicId: string;
}

// const sequelize = Postgres.Instance.Client;

// class Tags extends Model {
//   declare _id: string;
//   declare tag: string;
//   declare topicId: string;
// }

// Tags.init({
//   _id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },
//   tag: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   topicId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//   },
// },{
//   sequelize,
//   modelName: "tag",
//   timestamps: false,
//   underscored: true,
//   tableName: "tags"
// })

// export default Tags;
