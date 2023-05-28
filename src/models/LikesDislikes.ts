export class LikesDislikes {
  constructor(userId: string, postId: string, like: number) {}
}
export interface LikesDislikesDB {
  userId: string;
  postId: string;
  like: number;
}
