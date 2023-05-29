import z from "zod";

// tipagem de entrada de dados
export interface SignupInputDTO {
  name: string;
  email: string;
  password: string;
}

// tipagem de saída de dados para o Fron-end (sem password)
export interface SignupOutputDTO {
  message: string;
  token: string;
}

// verificação de dados para criação de signup
export const SignupSchema = z
  .object({
    name: z.string().min(2), // string com no mínimo 2 caracteres
    email: z.string().email(), // string do tipo email
    password: z.string().min(4), // string com no mínomo 4 caracteres
  })
  .transform((data) => data as SignupInputDTO);
