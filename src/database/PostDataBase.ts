import { PostDB } from "./../models/Posts";
import { BaseDataBase } from "./BaseDataBase";

export class PostDataBase extends BaseDataBase {
  // tabela posts
  private TABLE_POSTS = "posts";

  // retornar todos os posts
  public findAllPosts = async (q: string | undefined): Promise<PostDB[]> => {
    if (q) {
      const result: PostDB[] = await BaseDataBase.connection(
        this.TABLE_POSTS
      ).where("id", "LIKE", `%${q}%`);

      return result;
    } else {
      const result: PostDB[] = await BaseDataBase.connection(this.TABLE_POSTS);

      return result;
    }
  };
  // retornar post pelo id
  public async findPostById(id: string): Promise<PostDB | undefined> {
    const [postDB]: PostDB[] | undefined[] = await BaseDataBase.connection(
      this.TABLE_POSTS
    ).where({ id });

    return postDB;
  }
  // creição de post na database
  public insertPost = async (newPost: PostDB): Promise<PostDB> => {
    return await BaseDataBase.connection(this.TABLE_POSTS).insert(newPost);
  };

  // editar um post pelo seu id
  public async updatePost(idToEdit: string, postDB: PostDB) {
    await BaseDataBase.connection(this.TABLE_POSTS)
      .update(postDB)
      .where({ id: idToEdit });
  }

  // deletar post
  public async deletePost(idToDelete: string) {
    await BaseDataBase.connection(this.TABLE_POSTS)
      .delete()
      .where({ id: idToDelete});
  }
}
