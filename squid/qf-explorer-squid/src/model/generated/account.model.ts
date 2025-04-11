import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Transaction} from "./transaction.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    /**
     * Account address
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Баланс аккаунта
     */
    @BigIntColumn_({nullable: true})
    balance!: bigint | undefined | null

    /**
     * Транзакции, отправленные с этого аккаунта
     */
    @OneToMany_(() => Transaction, e => e.from)
    transactionsFrom!: Transaction[]

    /**
     * Транзакции, полученные этим аккаунтом
     */
    @OneToMany_(() => Transaction, e => e.to)
    transactionsTo!: Transaction[]

    /**
     * Временная метка последнего обновления
     */
    @DateTimeColumn_({nullable: false})
    updatedAt!: Date
}
