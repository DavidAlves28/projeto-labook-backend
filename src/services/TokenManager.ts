import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { USER_ROLES } from "../models/User";

dotenv.config();

// essa interface também pode ser alocada para outro arquivo
export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}

export class TokenManager {
  // converte o objeto de dados (payload) para um token string
  public createToken = (payload: TokenPayload): string => {
    const token = jwt.sign(payload, process.env.JWT_KEY as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
  };

  // valida e converte o token string para um objeto com dados (payload)
  public getPayload = (token: string): TokenPayload | null => {
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY as string);

      return payload as TokenPayload;

      // se a validação falhar, um erro é disparado pelo jsonwebtoken
      // o Erro vai ser tratado na camada Business 
    } catch (error) {
      return null;
    }
  };
}
