import { PostDataBase } from "./../database/PostDataBase";
import { PostBusiness } from "../business/PostBusiness";
import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";
import { CreatePostSchema } from "../dtos/posts/createPost.dto";
import { GetPostSchema } from "../dtos/posts/getPosts.dto";
import { DeletePostSchema } from "../dtos/posts/deletePost.dto";
import { UpdaterPostSchema } from "../dtos/posts/updatePost.dto";
import { ZodError } from "zod";
import { LikeDislikePSchema } from "../dtos/likesDislikes/likes-dislikes.dto";

export class PostController {
  // Injeção de dependência postBusiness
  constructor(private postBusiness: PostBusiness) {}

  // retorna todos os Posts
  public getAllPosts = async (req: Request, res: Response) => {
    try {
      // receber dados do Front-end
      const input = GetPostSchema.parse({
        token: req.headers.authorization,
      });

      // enviar para Businnes para verificações
      const output = await this.postBusiness.getAllPosts(input);

      // resposta para Front-end
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  // criar um post
  public createPost = async (req: Request, res: Response) => {
    try {
      // receber dados do Front-end
      const input = CreatePostSchema.parse({
        token: req.headers.authorization,
        content: req.body.content,
      });

      // enviar para Businnes para verificações
      const output = await this.postBusiness.createPost(input);
      // resposta para Front-end
      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  // editar post
  public updatePost = async (req: Request, res: Response) => {
    try {
      // receber dados do Front-end
      const input = UpdaterPostSchema.parse({
        token: req.headers.authorization,
        idPostToEdit: req.params.id,
        content: req.body.content,
      });
      // enviar para Businnes para verificações
      const output = await this.postBusiness.updatePost(input);

      // resposta para Front-end
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  // delete Post por id
  public deletePost = async (req: Request, res: Response) => {
    try {
      // receber dados do Front-end
      const input = DeletePostSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
      });

      // enviar para Business para verificações
      const output = await this.postBusiness.deletePost(input);

      // resposta para Front-end
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  // endpoint para Like e/ou Dislikes
  public LikeDislikePost = async (req: Request, res: Response) => {
    try {
      // receber dados do Front-end
      const input = LikeDislikePSchema.parse({
        postId: req.params.id,
        token: req.headers.authorization,
        like: req.body.like,
      });

      // enviar para Business para verificações
      const output = await this.postBusiness.likeDislikePost(input);

      // resposta para Front-end
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
