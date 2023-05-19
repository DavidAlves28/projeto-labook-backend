import { BaseError } from "./BaseError";

export class NotFundError extends BaseError{
    constructor(){
        super(404, "id  não existe")
    }
}