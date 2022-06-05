import {
    Logger,
    Controller,
    Headers,
    Get,
    Param,
    Post,
    Body,
    UseGuards,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';
import { AccountCreateDto } from './dto/account.create.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { logAccountData } from 'src/shared/utils';

@Controller('account')
export class AccountController {
    private readonly logger = new Logger(AccountController.name);
    constructor(
        private readonly accountService: AccountService,
        private jwtService: JwtService
        ) {}

    @UseGuards(JwtAuthGuard)
    @Get(":id")  
    async findOne(@Param("id") id: number, @Headers() headers): Promise<string> {   
        const account = await this.accountService.getOneAccount(id);
        
        // Throwing 401 if requesting user userId from JWT
        // does not match account.ownerId
        const authHeader = headers.authorization;
        const token = authHeader.split(' ')[1];
        const jwtDecoded = this.jwtService.decode(token);
        if (account.ownerId != jwtDecoded['userId']) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: `Account id ${id} does not belong to user!`
            }, HttpStatus.UNAUTHORIZED);
        }

        const response = logAccountData(account);
        return response;
    }

    @Post()
    async create(@Body() accountCreateDto: AccountCreateDto): Promise<AccountDto> {    
        return await this.accountService.createAccount(accountCreateDto);  
    }
}
