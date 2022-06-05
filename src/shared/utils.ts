import { AccountDto } from "src/account/dto/account.dto";
import { AccountType } from "src/account/account.entity";

export const logAccountData = async (account: AccountDto) => {
    const responseStringCustodial = 'Custodial wallet with name %name, balance %balance is stored under DFNS'
    const responseStringPsp = 'PSP account with name %name, balance %balance is stored with Stripe'
    let response: string;
    if (account.type == AccountType.CUSTODIAL) {
        response = responseStringCustodial
    } else if (account.type == AccountType.PSP) {
        response = responseStringPsp
    }
    response = response.replace('%name', account.name)
    response = response.replace('%balance', account.balance.toString())
    return response
  };