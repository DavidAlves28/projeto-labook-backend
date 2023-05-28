import { PostBusiness } from "../business/PostBusiness";
import { Request, Response } from "express";

export class PostController {
  // Injeção de dependência postBusiness
  constructor(private postBusiness: PostBusiness) {}

  public findAllPosts = async (req: Request, res: Response) => {
    try {
        const result = await this.postBusiness.findAllPosts()
        res.status(200).send(result) 
    } catch (error) {
      if (error instanceof Error) {
        console.log("errors");

        res.status(400).send(error);
      }
        else if (error instanceof Error) {
          res.status(404).send(error.message);
        } else {
          res.status(500).send("Erro inesperado");
        }
    }
  };
}
