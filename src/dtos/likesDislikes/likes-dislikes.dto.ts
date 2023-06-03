import z from "zod";
// tipagem de entrada de dados
export interface LikesDislikesInputDTO {
  postId: string;
  token: string;
  like: boolean;
}
// tipagem de saída de dados para o Fron-end (sem password)

export type LikesDislikesOutputDTO = undefined;

// verificação de dados para criação de LikesDislikes
export const LikeDislikePSchema = z
  .object({
    postId: z.string().min(1),
    token: z.string().min(1),
    like: z.boolean(),
  })
  .transform((data) => data as LikesDislikesInputDTO);
