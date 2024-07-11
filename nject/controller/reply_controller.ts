import {
  GET,
  Inject,
  PATCH,
  PathVariables,
  POST,
  RequestBody,
  RequestQuery,
  ResponseEntity,
  RestController,
} from "njectjs";
import { AuthorizedRequestBody } from "../../types/authentication";
import { ReplyService } from "../service/reply_service";
import { IAddReplyRequestBody } from "../../types/requests";

@RestController("/repies")
export class ReplyController {
  constructor(@Inject(ReplyService) private replyService: ReplyService) {}

  @GET("/public")
  @GET("/private")
  async getReplies(
    @RequestQuery query: { id: string },
    @RequestBody body: AuthorizedRequestBody | { userData: undefined }
  ) {
    const { id } = query;
    const { userData } = body;

    try {
      const replies = await this.replyService.getByTopicId(
        id,
        userData?.userId
      );

      return ResponseEntity.ok(replies);
    } catch (error) {
      console.log(error);
      return ResponseEntity.internalServerError({
        message: "Something went wrong while fetching replies",
      });
    }
  }

  @POST("/")
  public async addReply(
    @RequestBody body: IAddReplyRequestBody & AuthorizedRequestBody
  ) {
    const { topicId, reply, userData } = body;

    try {
      await this.replyService.create(reply, topicId, userData.username);
      return ResponseEntity.ok({ message: "Successfully added reply" });
    } catch (error) {
      console.log(error);
      return ResponseEntity.badRequest({
        message: "Something went wrong while adding reply",
      });
    }
  }

  @PATCH("/:id/upvote")
  public async upvoteReply(
    @PathVariables params: { id: string },
    @RequestBody body: AuthorizedRequestBody
  ) {
    const { userData } = body;
    const { id } = params;

    try {
      const reply = await this.replyService.triggerUpvote(id, userData.userId);
      return ResponseEntity.ok(reply);
    } catch (err) {
      return ResponseEntity.internalServerError({
        message: "Couldn't upvote reply",
      });
    }
  }

  @PATCH("/:id/downvote")
  public async downvoteReply(
    @PathVariables params: { id: string },
    @RequestBody body: AuthorizedRequestBody
  ) {
    const { userData } = body;
    const { id } = params;

    try {
      const reply = await this.replyService.triggerDownvote(
        id,
        userData.userId
      );
      return ResponseEntity.ok(reply);
    } catch (err) {
      return ResponseEntity.internalServerError({
        message: "Couldn't upvote reply",
      });
    }
  }
}
