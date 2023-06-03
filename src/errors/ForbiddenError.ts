import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
    // retornar caso o acesso d
    constructor(
        message: string = "Token válido, mas sem permissões suficientes"
    ) {
        super(403, message)
    }
}