import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AccountDto } from './dto/account.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Account } from './account.entity';
import { AccountCreateDto } from './dto/account.create.dto';
import { toAccountDto } from 'src/shared/mapper';

@Injectable()
export class AccountService {
    private readonly logger = new Logger(AccountService.name);
    
    constructor(
        @InjectRepository(Account)
        private readonly accountRepo: EntityRepository<Account>
      ) {}

    async getOneAccount(id: number): Promise<AccountDto> {    
        const account = await this.accountRepo.findOne({id: id});

        if (!account) {           
            throw new HttpException(`Account with id ${id} doesn't exist`, HttpStatus.BAD_REQUEST);    
        }
  
        return toAccountDto(account);  
    }

    async createAccount(accountDto: AccountCreateDto): Promise<AccountDto>{    
        const { name, type, balance, ownerId } = accountDto;

        const account = new Account();
        account.name = name;
        account.type = type;
        account.balance = balance;
        account.ownerId = ownerId;

        await this.accountRepo.persistAndFlush(account);
        return toAccountDto(account); 
    }
}
