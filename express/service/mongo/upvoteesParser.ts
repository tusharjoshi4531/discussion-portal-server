type UpvoteObject = {
  upvotees: string[];
  downvotees: string[];
  [key: string]: any;
};

export default {
  parseObject(obj: UpvoteObject, userId: string) {
    let upvoteStatus: 0 | -1 | 1 = 0;
    if (obj.upvotees.includes(userId)) {
      upvoteStatus = 1;
    } else if (obj.downvotees.includes(userId)) {
      upvoteStatus = -1;
    }

    return {
      ...obj,
      upvoteStatus,
    };
  },

  parseObjects(objs: UpvoteObject[], userId: string) {
    return objs.map((reply) => this.parseObject(reply, userId));
  },
};
