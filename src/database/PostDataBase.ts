import { PostDB } from "../models/Posts";
import { BaseDataBase } from "./BaseDataBase";

export class PostDataBase extends BaseDataBase {
  // tabela posts
  private TABLE_POSTS = "posts";
  // retornar todos os posts 
  public findAllPosts = async():Promise<PostDB[]>=>{
    return await BaseDataBase.connection(this.TABLE_POSTS)
  }
}
