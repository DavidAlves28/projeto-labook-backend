import { PostDataBase } from "../database/PostDataBase";
import { PostDB, Posts } from "../models/Posts";

export class PostBusiness {
  // Injeção de dependência do banco de dados 'PostDataBase'
  constructor(private postDataBase: PostDataBase) {}

  // retornar todos os posts
  public findAllPosts = async (): Promise<Posts[]> => {
    const postDB = await this.postDataBase.findAllPosts();
    const result = postDB.map(
      (post) =>
        new Posts(
            post.id,
            post.content,
            post.createdAt,
            post.updatedAt,
            post.likes,
            post.dislikes,
            post.creatorId,
        )
    );
    return result 
};
}
