import { Account } from '../account/account.entity';
import { AccountDto } from '../account/dto/account.dto';

export const toAccountDto = (data: Account): AccountDto => {
  const { id, name, type, balance, createdAt, ownerId } = data;

  let accountDto: AccountDto = {
    id,
    name,
    type,
    balance,
    createdAt,
    ownerId
  };

  return accountDto;
};