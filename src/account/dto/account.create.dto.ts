import { AccountType } from "../account.entity";
import { IsString, IsNumber, IsEnum } from "class-validator";

export class AccountCreateDto {  
    @IsString()
    name: string;

    @IsEnum(AccountType)
    type: AccountType;

    @IsNumber()
    balance: number;

    @IsNumber()
    ownerId: number;
}
