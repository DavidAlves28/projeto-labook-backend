import { IdGenerator } from "./../services/IdGenerator";
import { PostDataBase } from "../database/PostDataBase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/posts/createPost.dto";
import { PostDB, Posts } from "../models/Posts";
import { BadRequestError } from "../errors/BadRequestError";
import { GetPostInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto";
import {
  DeletePostInputDTO, DeletePostOutputDTO,
 
} from "../dtos/posts/deletePost.dto";

export class PostBusiness {
  // Injeção de dependência do banco de dados 'PostDataBase'
  constructor(
    private postDataBase: PostDataBase,
    private idGenerator: IdGenerator
  ) {}

  // retornar todos os posts
  public findAllPosts = async (
    input: GetPostInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const { q } = input;

    const postDB = await this.postDataBase.findAllPosts(q);

    const findPosts = postDB.map((post) => {
      const posts = new Posts(
        post.id,
        post.content,
        post.created_at,
        post.updated_at,
        post.likes,
        post.dislikes,
        post.creator_id
      );
      return posts.toBusinessModel();
    });

    const output: GetPostsOutputDTO = findPosts;
    return output;
  };
  // Criar Post
  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { creatorId, content } = input;
    const id = this.idGenerator.generate();
    const postExist = await this.postDataBase.findPostById(id);

    if (postExist) {
      throw new BadRequestError("'id' já existe");
    }
    // const creatorExist = await this.postDataBase.findCreatorById(creatorId)

    if(!creatorId){
      throw new BadRequestError("'creator_id' não existe")
    }
    const newPost = new Posts(
      id,
      content,
      new Date().toISOString(), // createdAt
      new Date().toISOString(), // updatedAt
      0, //likes
      0, //dislikes
      creatorId
    );
    const newPostDB = newPost.toDBModel();
    await this.postDataBase.insertPost(newPostDB);
    const output: CreatePostOutputDTO = {
      message: "Post criado com sucesso!",
      post: newPost.toBusinessModel(),
    };
    return output;
  };

  // editar Post
    // public updatePost =async (idToUpdate: string , input : ) => {
      
    // }
  //delete Post
  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { idToDelete } = input;
    const postExist = await this.postDataBase.findPostById(idToDelete);
    if (!postExist) {
      throw new BadRequestError("'id' não existe");
    }
    await this.postDataBase.deletePost(idToDelete);
    const output:DeletePostOutputDTO = {
      message: "Post deletado!",
    };
    return output;
  };
}
