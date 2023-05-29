import express from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { PostDataBase } from "../database/PostDataBase";
import { IdGenerator } from "../services/IdGenerator";

export const postRoute = express.Router();

const postController = new  PostController( new PostBusiness ( new PostDataBase, new IdGenerator))
postRoute.get('/',postController.findAllPosts)
postRoute.post('/',postController.createPost)
postRoute.delete('/:id', postController.deletePost)