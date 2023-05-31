import { LikesDislikes, LikesDislikesDB } from "./../models/LikesDislikes";

import { BaseDataBase } from "./BaseDataBase";
export class LikesDislikesDataBase extends BaseDataBase {
  public TABLE_LIKES_DISLIKES = "likes_dislikes";
  public TABLE_USERS ='users'
  public TABLE_POSTS ='posts'

  public findUserId = async (userId: string): Promise<LikesDislikes> => {
    if (userId) {
      const result: LikesDislikesDB[] = await BaseDataBase.connection(
        this.TABLE_LIKES_DISLIKES
      ).where("user_id", "LIKE", `%${userId}%`);
          
      return result;
    } else {
      const result: LikesDislikesDB[] = await BaseDataBase.connection(
        this.TABLE_LIKES_DISLIKES
      );

      return result;
    }
  };

  // para criar a tabela de relação entre user e post

  public createLikePost = async (like: LikesDislikesDB): Promise<void> => {
    await BaseDataBase.connection(this.TABLE_LIKES_DISLIKES).insert(like);
  };

  // alterar like e dislikes
  public updateLike = async (
    idToPostEdit: string,
    like: LikesDislikesDB
  ): Promise<void> => {
    await BaseDataBase.connection(this.TABLE_LIKES_DISLIKES)
      .update(like)
      .where({ id: idToPostEdit });
  };
}
