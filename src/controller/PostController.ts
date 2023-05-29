import { PostBusiness } from "../business/PostBusiness";
import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";
import { CreatePostSchema } from "../dtos/posts/createPost.dto";
import { GetPostSchema } from "../dtos/posts/getPosts.dto";
import { DeletePostSchema } from "../dtos/posts/deletePost.dto";


export class PostController {
  // Injeção de dependência postBusiness
  constructor(private postBusiness: PostBusiness) {}

  // retorna todos os Posts 
  public findAllPosts = async (req: Request, res: Response) => {
    try {
      const input = GetPostSchema.parse({
        q: req.query.q
      })
      const output = await this.postBusiness.findAllPosts(input);
      res.status(200).send(output);
    } catch (error) {
      if (error instanceof Error) {
        console.log("errors");

        res.status(400).send(error);
      } else if (error instanceof Error) {
        res.status(404).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  // criar um post
  public createPost = async (req: Request, res: Response) => {
    try {

      const input = CreatePostSchema.parse({
        creatorId : req.body.creator_id,
        content : req.body.content
      })

     
      const output= await this.postBusiness.createPost(input)
      res.status(201).send(output)

    } catch (error) {
      if (error instanceof BaseError) {
        console.log("errors");

        res.status(400).send(error);
      } else if (error instanceof Error) {
        res.status(404).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  // delete Post por id 
  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = DeletePostSchema.parse({
       idToDelete : req.params.id
      })
      const output = await this.postBusiness.deletePost(input);
      res.status(200).send(output);
    } catch (error) {
      if (error instanceof Error) {
        console.log("errors");

        res.status(400).send(error);
      } else if (error instanceof Error) {
        res.status(404).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
