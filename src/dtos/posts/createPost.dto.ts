import z from "zod";

// input de entrada para criação de Post
export interface CreatePostInputDTO {
  token: string;
  creatorId: string;
  content: string;
}

// saída do objeto quando criado
export interface CreatePostOutputDTO {
  message: string;
  post: {
    id: string;
    creatorId: string;
    content: string;
    createdAt: string;
    likes: number;
  };
}

export const CreatePostSchema = z
  .object({
    token: z.string().min(1),
    creatorId: z.string(),
    content: z.string().min(4),
  })
  .transform((data) => data as CreatePostInputDTO);
