import express from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { PostDataBase } from "../database/PostDataBase";

export const postRoute = express.Router();

const postController = new PostController(new PostBusiness(new PostDataBase()));
postRoute.get("/", postController.findAllPosts);
