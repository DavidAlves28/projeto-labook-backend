import z from "zod";
// tipagem de entrada de dados
export interface LoginInputDTO {
  email: string;
  password: string;
}
// tipagem de saída de dados para o Fron-end (sem password)
export interface LoginOutputDTO {
  message: string;
  token: string;
}
// verificação de dados para criação de login
export const LoginSchema = z
  .object({
    email: z.string().email(), // string do tipo email
    password: z.string().min(4), // string com no mínomo 4 caracteres
  })
  .transform((data) => data as LoginInputDTO);
