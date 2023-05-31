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
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/posts/deletePost.dto";
import { LikesDislikesDataBase } from "../database/LikeDislikesDataBase";
import { LikesDislikesDB } from "../models/LikesDislikes";
import { LikesDislikesOutputDTO } from "../dtos/likesDislikes/likes-dislikes.dto";
import {
  UpdatePostInputDTO,
  UpdatePostOutputDTO,
} from "../dtos/posts/updatePost.dto";
import { TokenManager } from "../services/TokenManager";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { PostModel } from "../models/Posts";
import { USER_ROLES } from "../models/User";

export class PostBusiness {
  // Injeção de dependência do banco de dados 'PostDataBase'
  constructor(
    private postDataBase: PostDataBase,
    private idGenerator: IdGenerator,
    private likeDataBase: LikesDislikesDataBase,
    private tokenManager: TokenManager
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

    if (!creatorId) {
      throw new BadRequestError("'creator_id' não existe");
    }
    // estância do novo post
    const newPost = new Posts(
      id,
      content,
      new Date().toISOString(), // createdAt
      new Date().toISOString(), // updatedAt
      0, //likes
      0, //dislikes
      creatorId
    );

    // estância da relação user => post
    // adicionar propriedades para tabelas de relação
    const like: LikesDislikesDB = {
      user_id: newPost.getCreatorId(),
      post_id: newPost.getId(),
      like: newPost.getLikes(),
    };
    // criar post
    const newPostDB = newPost.toDBModel();
    await this.postDataBase.insertPost(newPostDB);
    // criar tabela de relação
    await this.likeDataBase.createLikePost(like);

    // Retorno para Fron-end

    const output: CreatePostOutputDTO = {
      message: "Post criado com sucesso!",
      post: newPost.toBusinessModel(),
    };
    return output;
  };

  // editar Post
  public updatePost = async (
    input: UpdatePostInputDTO
  ): Promise<UpdatePostOutputDTO> => {
    const { token, idPostToEdit, content } = input;

    // requer token do usuario
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    // Buscar post na data base
    const postExist = await this.postDataBase.findPostById(idPostToEdit);
    if (!postExist) {
      throw new NotFoundError("'id' não encontrado.");
    }
    // verificar se quem criou o post é o mesmo do login atraves do id e creator_id
    if (payload.id !== postExist.creator_id) {
      throw new ForbiddenError("somente quem criou o Post pode editá-lo");
    }

    //estânciar novo post
    const newPost = new Posts(
      postExist.id,
      postExist.content,
      postExist.created_at,
      postExist.updated_at,
      postExist.likes,
      postExist.dislikes,
      payload.id
    );

    // editar conteúdo
    newPost.setContent(content);
    // atualizar data de atualização
    // formato = DD/MM/YYYY , horalocal
    newPost.setUpdatedAt(new Date().toLocaleString());
    // modelando tipagem
    const updatedNewPost = newPost.toDBModel();

    // enviar dados para DB
    await this.postDataBase.updatePost(idPostToEdit, updatedNewPost);
    // saída para Front-end
    const output: UpdatePostOutputDTO = {
      message: "Post Atualizado com sucesso!",
      post: newPost.toBusinessModel(),
    };
    return output;
  };

  //delete Post
  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { idToDelete, token } = input;
    // verificar se post existe
    // requer token do usuario
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    // Buscar post na data base
    const postExist = await this.postDataBase.findPostById(idToDelete);
    if (!postExist) {
      throw new NotFoundError("'id' não encontrado.");
    }

    // O ADMIN também poderá deletar o Post
    // verificar se quem criou o post é o mesmo do login atraves do id e creator_id
    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== postExist.creator_id) {
        throw new ForbiddenError("somente quem criou o Post ou administrador pode deleta-lo");
      }
    }

    // Enviar para DB
    await this.postDataBase.deletePost(idToDelete);
    // Retorno para Fron-end
    const output: DeletePostOutputDTO = {
      message: "Post deletado!",
    };
    return output;
  };
}
