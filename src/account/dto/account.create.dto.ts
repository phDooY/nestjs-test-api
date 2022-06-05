import { AccountType } from "../account.entity";

export class AccountCreateDto {  
    name: string;
    type: AccountType;
    balance: number;
    ownerId: number;
}
