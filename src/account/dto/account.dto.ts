import { AccountType } from "../account.entity";

export class AccountDto {
    id: number;  
    name: string;  
    type: AccountType;
    balance: number;
    createdAt: Date;
    ownerId: number;
}
