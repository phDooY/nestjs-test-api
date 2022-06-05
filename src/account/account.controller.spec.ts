import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { CanActivate } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountCreateDto } from './dto/account.create.dto';
import { AccountType } from './account.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import 'dotenv/config';

describe('AccountController', () => {
  let controller: AccountController;
  let jwtUser1 = process.env.JWT_USER_1;
  let jwtUser2 = process.env.JWT_USER_2;

  const mockAccountService = {
    getOneAccount: jest.fn((id: number) => {
      let mockAccounts = {
        1: {
          name: 'acc1',
          type: 'custodial',
          balance: 1.212,
          ownerId: 1,
        },
        2: {
          name: 'acc2',
          type: 'psp',
          balance: 1.212,
          ownerId: 1,
        },
        3: {
          name: 'acc3',
          type: 'custodial',
          balance: 1.212,
          ownerId: 2,
        }
      };
      return mockAccounts[id]

    }),
    createAccount: jest.fn((dto: AccountCreateDto) => {
      return {
        name: dto.name,
        type: dto.type,
        balance: dto.balance,
        ownerId: dto.ownerId,
      };
    }),
  };

  const mockJwtAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.SECRETKEY,
          signOptions: {
            expiresIn: process.env.EXPIRESIN,
          },
        }),
      ],
      controllers: [AccountController],
      providers: [AccountService, ]
    })
      .overrideProvider(AccountService)
      .useValue(mockAccountService)
      .overrideProvider(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should create account and return it', async () => {
    const name: string = 'test-acc';
    expect(
      await controller.create({
        name,
        type: AccountType.PSP,
        balance: 123.123,
        ownerId: 1
      }),
    ).toEqual({
      name,
      type: 'psp',
      balance: 123.123,
      ownerId: 1
    });
  });

  it('should return account log data for custodial wallet type', async () => {
    expect(await controller.findOne(
        1,
        {'authorization': `Bearer ${jwtUser1}`}
      )).toEqual(
        'Custodial wallet with name acc1, balance 1.212 is stored under DFNS'
      );
  });

  it('should return account log data for psp wallet type', async () => {
    expect(await controller.findOne(
        2,
        {'authorization': `Bearer ${jwtUser1}`}
      )).toEqual(
        'PSP account with name acc2, balance 1.212 is stored with Stripe'
      );
  });

  it('should return error for user trying to access not their account', async () => {
    try {
      await controller.findOne(
        3,
        {'authorization': `Bearer ${jwtUser1}`}
      )
    } catch (error) {
      expect(error).toStrictEqual(new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: `Account id ${3} does not belong to user!`
        }, HttpStatus.UNAUTHORIZED));
    }
  });
});
