import z from "zod";
// tipagem de entrada de dados
export interface LikesDislikesInputDTO {
  userId: string;
  postId: string;
  like: number
}
// tipagem de saída de dados para o Fron-end (sem password)
export interface LikesDislikesOutputDTO {
  userId: string;
  postId: string;
  like: number
}
// verificação de dados para criação de LikesDislikes
export const LikesDislikesSchema = z
  .object({
    userId: z.string().min(3), // string com no mínimo 3 caracteres
    postId: z.string().min(3), // string com no mínimo 3 caracteres
    like: z.number().max(1).default(0), // string com no mínomo 4 caracteres
  })
  .transform((data) => data as LikesDislikesInputDTO);
