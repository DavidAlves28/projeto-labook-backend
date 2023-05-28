import { PostDB } from "../models/Posts";
import { BaseDataBase } from "./BaseDataBase";

export class PostDataBase extends BaseDataBase {
  // tabela posts
  private TABLE_POSTS = "posts";

  // retornar todos os posts
  public findAllPosts = async (): Promise<PostDB[]> => {
    return await BaseDataBase.connection(this.TABLE_POSTS);
  };
  
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
  public async deletePost(idToEdit: string) {
    await BaseDataBase.connection(this.TABLE_POSTS)
      .delete()
      .where({ id: idToEdit });
  }
}
