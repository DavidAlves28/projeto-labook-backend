import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
    // retornar caso um token seja válido, mas sem permissões necessárias 
    constructor(
        message: string = "Token válido, mas sem permissões suficientes"
    ) {
        super(403, message)
    }
}