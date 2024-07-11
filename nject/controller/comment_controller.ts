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
import { IAddCommentRequestBody } from "../../types/requests";
import { AuthorizedRequestBody } from "../../types/authentication";
import { CommentService } from "../service/comment_service";

@RestController("/comments")
export class CommentController {
  constructor(@Inject(CommentService) private commentService: CommentService) {}

  @GET("/public")
  @GET("/private")
  public async getComments(
    @RequestQuery query: { replyId: string; parentId: string },
    @RequestBody body: AuthorizedRequestBody | { userData: undefined }
  ) {
    const { replyId, parentId } = query;
    const { userData } = body;

    console.log({ userData, replyId, parentId });

    try {
      const comments = await this.commentService.getChildren(
        replyId,
        parentId,
        userData?.userId
      );

      return ResponseEntity.ok(comments);
    } catch (err) {
      console.log(err);
      return ResponseEntity.internalServerError({
        message: "Something went wrong while fetching comments",
      });
    }
  }

  @POST("/")
  public async addComment(
    @RequestBody body: AuthorizedRequestBody & IAddCommentRequestBody
  ) {
    const { userData, replyId, parentId, content } = body;
    console.log({ userData, replyId, parentId, content });

    try {
      const result = await this.commentService.create(
        userData.username,
        replyId,
        parentId,
        content
      );

      const comment = {
        id: result._id.toString(),
        ...result.toObject(),
      };

      return ResponseEntity.ok(comment);
    } catch (error) {
      console.log(error);
      return ResponseEntity.internalServerError({
        message: "Something went wrong while adding comment",
      });
    }
  }

  @PATCH("/:id/upvote")
  public async triggerUpvote(
    @PathVariables params: { id: string },
    @RequestBody body: AuthorizedRequestBody
  ) {
    const { id } = params;
    const { userData } = body;

    try {
      const comment = await this.commentService.triggerUpvote(
        id,
        userData.userId
      );
      return ResponseEntity.ok(comment);
    } catch (err) {
      return ResponseEntity.internalServerError({
        message: "Couldn't upvote comment",
      });
    }
  }

  @PATCH("/:id/downvote")
  public async triggerDownvote(
    @PathVariables params: { id: string },
    @RequestBody body: AuthorizedRequestBody
  ) {
    const { id } = params;
    const { userData } = body;

    try {
      const comment = await this.commentService.triggerDownvote(
        id,
        userData.userId
      );
      return ResponseEntity.ok(comment);
    } catch (err) {
      return ResponseEntity.internalServerError({
        message: "Couldn't upvote comment",
      });
    }
  }
}
