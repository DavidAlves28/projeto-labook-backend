import z from "zod"
import { PostModel } from "../../models/Posts"


export interface GetPostInputDTO {
  token: string
}

// PostModel é a estrutura de Post que será devolvida para o Front

export type GetPostsOutputDTO = PostModel[]

export const GetPostSchema = z.object({
 token: z.string().min(10)
}).transform(data => data as GetPostInputDTO)