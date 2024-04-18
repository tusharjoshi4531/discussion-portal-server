import { Op } from "sequelize";
import Tags from "../../models/postgres/tag";
import Topics from "../../models/postgres/topic";
import User from "../../models/postgres/user";
import UserStarTopic from "../../models/postgres/userStarTopic";
import { ITopicData, IResponseTopicData } from "../../types/discussion";

export default {
  async findByTag(tags: string) {
    try {
      let result;
      if (tags === "all") {
        result = await Topics.findAll({
          include: [
            {
              model: Tags,
              as: "tags",
            },
          ],
        });
      } else {
        const query = JSON.parse(tags!);
        console.log({ query, tags });
        result = await Topics.findAll({
          include: [
            {
              model: Tags,
              as: "tags",
              where: {
                tag: {
                  [Op.in]: query,
                },
              },
            },
          ],
        });
      }

      // TODO FIX QUERRIES

      const data: IResponseTopicData[] = result.map((topic) => ({
        title: topic.title,
        tags: topic.tags.map((tag) => tag.tag),
        author: topic.author,
        description: topic.description,
        id: topic._id,
        isStarred: false,
      }));

      return data;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't find topic with given tags");
    }
  },
  async findById(id: string) {
    try {
      if (id === "") {
        throw new Error("Couldn't find topic id");
      }

      const result = await Topics.findByPk(id, {
        include: [
          {
            model: Tags,
            as: "tags",
            attributes: ["tag"],
          },
        ],
      });

      if (!result) {
        throw new Error("Couldn't fid topic with given id");
      }

      return result;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't find topic with given id");
    }
  },
  async findStarredByUser(userId: string) {
    try {
      const result = await UserStarTopic.findAll({
        where: {
          userId,
        },
      });

      return result.map((topic) => topic.topicId);
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't find starred topics by given user");
    }
  },
  async star(userId: string, topicId: string) {
    try {
      await UserStarTopic.create({
        userId,
        topicId,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't star topic");
    }
  },
  async unstar(userId: string, topicId: string) {
    try {
      await UserStarTopic.destroy({
        where: {
          userId,
          topicId,
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't unstar topic");
    }
  },
  async create(topicData: ITopicData & { authorId: string }) {
    try {
      const createdTopic = await Topics.create({
        authorId: topicData.authorId,
        author: topicData.author,
        title: topicData.title,
        description: topicData.description,
      });

      await Tags.bulkCreate(
        topicData.tags.map((tag) => ({ topicId: createdTopic._id, tag }))
      );

      createdTopic.tags = await createdTopic.getTags();

      return createdTopic;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't create topic");
    }
  },
};
