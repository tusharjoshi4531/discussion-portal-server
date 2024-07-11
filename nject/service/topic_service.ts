import { Service } from "njectjs";
import TopicModel from "../../models/mogo/topic";
import { IResponseTopicData, ITopicData } from "../../types/discussion";
import UserTopicStoreModel from "../../models/mogo/user-topic-store";

@Service
export class TopicService {
  public async findByTag(tags: string) {
    let result;
    if (tags === "all") {
      result = await TopicModel.find();
    } else {
      const query = JSON.parse(tags!);
      result = await TopicModel.find({ tags: { $all: query } });
    }

    // TODO FIX QUERRIES

    const data: IResponseTopicData[] = result.map((topic) => ({
      title: topic.title,
      tags: topic.tags,
      author: topic.author,
      description: topic.description,
      id: topic._id.toString(),
      isStarred: false,
    }));

    return data;
  }

  public async findById(id: string) {
    if (id === "") {
      throw new Error("Couldn't find topic id");
    }

    const result = await TopicModel.findById(id);

    if (!result) {
      throw new Error("Couldn't fid topic with given id");
    }

    return result;
  }

  async findStarredByUser(userId: string) {
    const result = await UserTopicStoreModel.findOne({ userId });
    return result ? result.starredId : [];
  }

  public async star(userId: string, topicId: string) {
    const userData = await UserTopicStoreModel.findOne({
      userId,
    });

    if (userData) {
      if (!userData.starredId.includes(topicId)) {
        userData.starredId.push(topicId);
      }
      userData.save();
    } else {
      UserTopicStoreModel.create({
        userId,
        starredId: [topicId],
      });
    }
  }

  public async unstar(userId: string, topicId: string) {
    const userData = await UserTopicStoreModel.findOne({ userId });

    if (!userData) throw new Error("Couldn't find user data");

    userData.starredId = userData.starredId.filter((id) => id !== topicId);
    userData.save();
  }

  public async create(topicData: ITopicData) {
    try {
      const result = await TopicModel.create(topicData);

      return result;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't create topic");
    }
  }
}
