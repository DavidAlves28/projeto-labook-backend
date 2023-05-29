import z from "zod";

// input de entrada para criação de Post
export interface CreatePostInputDTO {
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

export const CreatePostSchema = z.object({
    creatorId: z.string(),
    content: z.string().min(4),
  })
  .transform((data) => data as CreatePostInputDTO);
