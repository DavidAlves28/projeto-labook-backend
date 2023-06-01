import z from "zod";

// input de entrada para criação de Post
export interface UpdatePostInputDTO {
  token: string;
  idPostToEdit: string;
  content: string;
}

// saída do objeto quando criado
export interface UpdatePostOutputDTO {
  message: string;
  post: {
    id: string;
    content: string;
    createdAt: string;
    likes: number;
  };
}

export const UpdaterPostSchema = z
  .object({
    token: z.string().min(1),
    idPostToEdit: z.string(),
    content: z.string().min(4),
  })
  .transform((data) => data as UpdatePostInputDTO);
