import { IdGenerator } from "./../services/IdGenerator";
import { PostDataBase } from "../database/PostDataBase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/posts/createPost.dto";
import { Posts } from "../models/Posts";
import { BadRequestError } from "../errors/BadRequestError";
import { GetPostInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/posts/deletePost.dto";

import { LikesDislikesDB } from "../models/LikesDislikes";
import {
  LikesDislikesInputDTO,
  LikesDislikesOutputDTO,
} from "../dtos/likesDislikes/likes-dislikes.dto";
import {
  UpdatePostInputDTO,
  UpdatePostOutputDTO,
} from "../dtos/posts/updatePost.dto";
import { TokenManager } from "../services/TokenManager";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { USER_ROLES } from "../models/User";
import { POST_LIKE } from "../models/LikesDislikes";

export class PostBusiness {
  // Injeção de dependências
  constructor(
    private postDataBase: PostDataBase, // Data Base
    private idGenerator: IdGenerator, // UUID
    private tokenManager: TokenManager // Gerenciador de JWT Token
  ) {}

  // retornar todos os posts
  public getAllPosts = async (
    input: GetPostInputDTO
  ): Promise<GetPostsOutputDTO> => {
    // receber dados do Front-end
    const { token } = input;
    // requer token do usuário logado

    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    // verificar se id existe  na DB.
    const postDB = await this.postDataBase.getAllPosts();
    // estância para novo post
    const findPosts = postDB.map((post) => {
      const posts = new Posts(
        post.id,
        post.content,
        post.created_at,
        post.updated_at,
        post.likes,
        post.dislikes,
        post.creator_id,
        post.creator_name
      );
      return posts.toBusinessModel();
    });
    // retorno para Front-end
    const output: GetPostsOutputDTO = findPosts;
    return output;
  };

  // Criar Post
  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    // receber dados do Front-end
    const { token, content } = input;

    // requer token do usuário logado
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    // gerar id pelo UUID
    const id = this.idGenerator.generate();
    // verificar se id existe  na DB.
    const postExist = await this.postDataBase.findPostById(id);
    if (postExist) {
      throw new BadRequestError("'id' já existe");
    }

    // estância para novo post
    const newPost = new Posts(
      id,
      content,
      new Date().toLocaleString(), // createdAt
      new Date().toLocaleString(), // updatedAt
      0, //likes
      0, //dislikes
      payload.id,
      payload.name
    );

    // criar post
    const newPostDB = newPost.toDBModel();
    await this.postDataBase.insertPost(newPostDB);

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
      payload.id,
      payload.name
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
        throw new ForbiddenError(
          "somente quem criou o Post ou administrador pode deleta-lo"
        );
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

  
  // endpoint para like e/ou dislike
  public likeDislikePost = async (
    input: LikesDislikesInputDTO
  ): Promise<LikesDislikesOutputDTO> => {
    const { token, like, postId } = input;
    
    // requer token do usuário logado
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    // Buscar post na data base
    const postExist = await this.postDataBase.findPostWithPostId(postId);

    if (!postExist) {
      throw new NotFoundError("'id' não encontrado.");
    }
    //estânciar novo post
    const newPost = new Posts(
      postExist.id,
      postExist.content,
      postExist.created_at,
      postExist.updated_at,
      postExist.likes,
      postExist.dislikes,
      payload.id,
      payload.name
    );

    // verificar se like é True ou False
    const likeDB = like ? 1 : 0;

    const likeDislikeDB: LikesDislikesDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeDB,
    };

    // verificar se tabela de relaciomento
    const LikeDislikesExists = await this.postDataBase.findLikeDislike(
      likeDislikeDB
    );
  
    // se like estiver checked
    if (LikeDislikesExists === POST_LIKE.ALREADY_LIKED) {
      // caso o like for 1 e ser clicado , então remover  o like.
      // Caso dê um like em um post que já tenha dado like, o like é desfeito.
      if (like) {
        await this.postDataBase.deleteLikeDislike(likeDislikeDB);
        newPost.removeLike();
      } else {
        // decrementar o like se houver do DB e encrementar um dislike
        await this.postDataBase.updateLikeDislike(likeDislikeDB); // edita o like no DB.
        newPost.removeLike(); //decrementa o like.
        newPost.addDislike(); // encrementa o dislike.
      }
      // Se dislike for checked
    } else if (LikeDislikesExists === POST_LIKE.ALREADY_DISLIKED) {
      // Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.
      if (like === false) {
        //  remove like do DB
        await this.postDataBase.deleteLikeDislike(likeDislikeDB);
        newPost.removeDislike(); //decrementa o like.
      }
      // Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like
      else {
        await this.postDataBase.updateLikeDislike(likeDislikeDB); // edita o like no DB.
        newPost.removeDislike(); // decrementa o like.
        newPost.addLike(); // encrementa o like.
      }
    }
    // Caso não houver nunhum like ou dislike
    else {
      await this.postDataBase.insertLikeDislike(likeDislikeDB); // inserir no DB
      // se like for 1 encrementar like
      // se like for 0 encrementar dislike
      like ? newPost.addLike() : newPost.addDislike();
    }

    // tipagem para enviar ao DB
    const updatedNewPost = newPost.toDBModel();
    // update Post
    await this.postDataBase.updatePost(postId, updatedNewPost);
    // retorno para o Front
    const output: LikesDislikesOutputDTO = undefined;
    return output;
  };
}
