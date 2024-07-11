import {
  GET,
  Inject,
  PATCH,
  POST,
  RequestBody,
  RequestQuery,
  ResponseEntity,
  RestController,
} from "njectjs";
import { TopicService } from "../service/topic_service";
import { AuthorizedRequestBody } from "../../types/authentication";
import { ITopicData } from "../../types/discussion";

@RestController("/topics")
export class TopicsController {
  constructor(@Inject(TopicService) private topicService: TopicService) {}

  @GET("/getPublic")
  public async getTopicsForPublic(
    @RequestQuery query: { tags: string; getStarred: boolean }
  ) {
    const { tags } = query;
    try {
      const data = await this.topicService.findByTag(tags);
      return ResponseEntity.ok(data);
    } catch (error) {
      console.log(error);
      return ResponseEntity.internalServerError({
        message: "Something went wrong while fetching topics for public",
      });
    }
  }

  @GET("/getPrivate")
  public async getTopicsFroUser(
    @RequestQuery query: { tags: string; getStarred: string },
    @RequestBody body: AuthorizedRequestBody
  ) {
    const { tags, getStarred } = query;

    try {
      const data = await this.topicService.findByTag(tags);

      const starredTopicsId = await this.topicService.findStarredByUser(
        body.userData.userId
      );

      const responseData = data
        .map((data) => ({
          ...data,
          isStarred: starredTopicsId.includes(data.id),
        }))
        .filter((data) => getStarred === "false" || data.isStarred);

      return ResponseEntity.ok(responseData);
    } catch (error) {
      console.log(error);
      return ResponseEntity.badRequest({
        message: "Something went wrong while fetching topics for users",
      });
    }
  }

  @GET("/getById")
  public async getTopicById(@RequestQuery query: { id: string }) {
    const { id } = query;

    try {
      const data = await this.topicService.findById(id);

      return ResponseEntity.ok(data);
    } catch (error) {
      console.log(error);
      return ResponseEntity.internalServerError({
        message: "Something went wrong while fetching topics for public",
      });
    }
  }

  @POST("/add")
  public async addTopic(@RequestBody body: ITopicData) {
    const topicData = body;

    try {
      await this.topicService.create(topicData);

      ResponseEntity.created({ message: "Successfuly created topic" });
    } catch (error) {
      console.log(error);
      ResponseEntity.internalServerError({ message: "Something went wrong" });
    }
  }

  @PATCH("/star")
  public async starTopic(
    @RequestBody
    body: AuthorizedRequestBody<{ topicId: string; state: boolean }>
  ) {
    try {
      const userId = body.userData.userId;
      const topicId = body.topicId;

      if (body.state) this.topicService.star(userId, topicId);
      else this.topicService.unstar(userId, topicId);

      return ResponseEntity.ok({ message: "Successfully updated star state" });
    } catch (error) {
      console.log(error);
      ResponseEntity.internalServerError({
        message: "Something went wrong while starring the topic",
      });
    }
  }
}
