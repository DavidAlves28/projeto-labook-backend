import { PostDB, PostDBWithCreatorName } from "./../models/Posts";
import { BaseDataBase } from "./BaseDataBase";
import { UserDataBase } from "./UserDataBase";

export class PostDataBase extends BaseDataBase {
  // tabela posts
  private static TABLE_POSTS = "posts";

  // retornar todos os posts com id e name do criador.
  public getAllPosts = async (): Promise<PostDBWithCreatorName[]> => {
    
      const result = await BaseDataBase.connection(PostDataBase.TABLE_POSTS)
        .select(
          `${PostDataBase.TABLE_POSTS}.id `,
          `${PostDataBase.TABLE_POSTS}.creator_id`,
          `${PostDataBase.TABLE_POSTS}.content`,
          `${PostDataBase.TABLE_POSTS}.created_at`,
          `${PostDataBase.TABLE_POSTS}.updated_at`,
          `${PostDataBase.TABLE_POSTS}.likes`,
          `${PostDataBase.TABLE_POSTS}.dislikes`,
          `${UserDataBase.TABLE_USERS}.name as creator_name`
        )
        .join(
          `${UserDataBase.TABLE_USERS}`,
          `${PostDataBase.TABLE_POSTS}.creator_id`,
          "=",
          `${UserDataBase.TABLE_USERS}.id`
        );
        
      return result      
 
  };
  // retornar post pelo id
  public async findPostById(id: string): Promise<PostDB | undefined> {
    const [postDB]: PostDB[] | undefined[] = await BaseDataBase.connection(
      PostDataBase.TABLE_POSTS
    ).where({ id });

    return postDB;
  }
  // creição de post na database
  public insertPost = async (newPost: PostDB): Promise<PostDB> => {
    return await BaseDataBase.connection(PostDataBase.TABLE_POSTS).insert(
      newPost
    );
  };

  // editar um post pelo seu id
  public async updatePost(idToEdit: string, postDB: PostDB) {
    await BaseDataBase.connection(PostDataBase.TABLE_POSTS)
      .update(postDB)
      .where({ id: idToEdit });
  }

  // deletar post
  public async deletePost(idToDelete: string) {
    await BaseDataBase.connection(PostDataBase.TABLE_POSTS)
      .delete()
      .where({ id: idToDelete });
  }
}
