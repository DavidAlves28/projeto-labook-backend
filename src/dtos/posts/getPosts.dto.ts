import z from "zod"
import { PostModel } from "../../models/Posts"


export interface GetPostInputDTO {
  q: string
}

// PostModel é a estrutura de Post que será devolvida para o Front

export type GetPostsOutputDTO = PostModel[]

export const GetPostSchema = z.object({
  q: z.string().min(1).optional()
}).transform(data => data as GetPostInputDTO)