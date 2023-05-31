import {
  GetUsersInputDTO,
  GetUsersOutputDTO,
} from "./../dtos/users/getUsers.dto";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";
import { UserDataBase } from "./../database/UserDataBase";
import { USER_ROLES, User } from "../models/User";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { HashManager } from "../services/HashManager";
import { LikesDislikesDataBase } from "../database/LikeDislikesDataBase";
import { LikesDislikes } from "../models/LikesDislikes";
import { LikesDislikesInputDTO, LikesDislikesOutputDTO } from "../dtos/likesDislikes/likes-dislikes.dto";

export class UserBusiness {
  constructor(
    private userDatabase: UserDataBase,
    private idgenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager,
    private likeDataBase: LikesDislikesDataBase
  ) {}

  // endpoint que retorna todos os users
  // vai ser usado para vericação de ADMIN
  public getUsers = async (
    input: GetUsersInputDTO
  ): Promise<GetUsersOutputDTO> => {
    const { q, token } = input;
    const payload = await this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new NotFoundError("Token invalido");
    }
    if (payload.role !== USER_ROLES.ADMIN) {
      throw new BadRequestError("Acesso restrito, somente Administratores.");
    }
    const usersDB = await this.userDatabase.findUsers(q);

    const users = usersDB.map((userDB) => {
      const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at
      );

      return user.toBusinessModel();
    });

    const output: GetUsersOutputDTO = users;

    return output;
  };

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    // dados recebidos do front-end para criação do user.
    const { name, email, password } = input;

    // id  gerado pelo UUID
    const id = this.idgenerator.generate();
    const hashPassword = await this.hashManager.hash(password);

    // verifica se o id criado ja existe
    const userDBExists = await this.userDatabase.findUserById(id);
    if (userDBExists) {
      throw new BadRequestError("'id' já existe");
    }
    // verificar se o email já existe
    const emailExist = await this.userDatabase.findUserByEmail(email);
    if (emailExist) {
      throw new BadRequestError("'email' já existe");
    }
    // criar  na instância de user (novo user)
    const newUser = new User(
      id,
      name,
      email,
      hashPassword,
      USER_ROLES.ADMIN, // só é possível criar users com contas normais.
      new Date().toISOString() // createdAt.
    );

    // tipagem para criar novo user
    const newUserDB = newUser.toDBModel();

    // inserindo  no UserDataBase novo usuário
    await this.userDatabase.insertUser(newUserDB);

    // criar tokenPayload do user depois de insirido do banco de dados.
    const tokenPayload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };
    // criar token do user
    const token = this.tokenManager.createToken(tokenPayload);
    // saida para o front-end com menssagem de sucesso e o seu token.
    const output: SignupOutputDTO = {
      message: "Cadastro realizado com sucesso",
      token: token,
    };

    return output;
  };

  // criar login de conta existente
  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    // dados do front-end
    const { email, password } = input;
    // verificar se o email existe no banco de dados.
    const userDB = await this.userDatabase.findUserByEmail(email);
    // se não existe retornar erro e menssagem.
    if (!userDB) {
      throw new NotFoundError("'email' não encontrado");
    }
    // comparar password com banco de dados.
    const passwordCompare = await this.hashManager.compare(
      password,
      userDB.password
    );

    // se password informado for diferente do Hashpassword do DB, retornar erro.
    if (!passwordCompare) {
      throw new BadRequestError("email' ou 'password' incorretos");
    }
    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );

    // criar tokenPayload do user depois de insirido do banco de dados.
    const tokenPayload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };

    // criar token do user logado
    const token = this.tokenManager.createToken(tokenPayload);

    // saida para o front-end com menssagem de sucesso e o seu token.
    const output: LoginOutputDTO = {
      message: "Login realizado com sucesso",
      token: token,
    };

    return output;
  };

  // public getUsersWithPost = async (
  //   input: GetUsersInputDTO
  // ): Promise<LikesDislikesOutputDTO> => {
  //   const { q, token } = input;
  //   const payload = await this.tokenManager.getPayload(token);

  //   if (payload === null) {
  //     throw new NotFoundError("Token invalido");
  //   }
  //   if (payload.role !== USER_ROLES.ADMIN) {
  //     throw new BadRequestError("Acesso restrito, somente Administratores.");
  //   }
  //   const usersDB = await this.userDatabase.findUsers(q);

  //   const users = usersDB.map((userDB) => {
  //     const user = new User(
  //       userDB.id,
  //       userDB.name,
  //       userDB.email,
  //       userDB.password,
  //       userDB.role,
  //       userDB.created_at
  //     );

  //     return user.toBusinessModel();
  //   });

  //   // // criar objeto.
  //   // const tableRelation : LikesDislikesOutputDTO = await this.likeDataBase.findUserId(payload.id);
  
  //   // console.log(tableRelation);
    
  //   // se houver token, então retornar seu id do token.

  //   const output: GetUsersOutputDTO = users;

   
  // };
}
