import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    Enum,
  } from '@mikro-orm/core';

@Entity()
export class Account {
    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @Enum()
    type: AccountType;

    @Property({ columnType: 'float', nullable: false})
    balance: number;
    
    @Property({ default: Date() })
    createdAt: Date = new Date(); 

    @Property({ onUpdate: () => new Date() })
    updatedAt?: Date = new Date();

    @Property()
    ownerId: number;
}

export const enum AccountType {
  CUSTODIAL = 'custodial',
  PSP = 'psp',
}
