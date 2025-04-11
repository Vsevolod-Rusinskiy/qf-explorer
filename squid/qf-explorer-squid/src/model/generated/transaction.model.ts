import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Block} from "./block.model"
import {Account} from "./account.model"

@Entity_()
export class Transaction {
    constructor(props?: Partial<Transaction>) {
        Object.assign(this, props)
    }

    /**
     * Хеш транзакции
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Блок, в котором находится транзакция
     */
    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block

    /**
     * Номер блока для удобства запросов
     */
    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * Временная метка создания транзакции
     */
    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    /**
     * Аккаунт отправителя
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    from!: Account

    /**
     * Аккаунт получателя (может быть null для некоторых типов транзакций)
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    to!: Account | undefined | null

    /**
     * Сумма передачи
     */
    @Index_()
    @BigIntColumn_({nullable: true})
    amount!: bigint | undefined | null

    /**
     * Комиссия за транзакцию
     */
    @BigIntColumn_({nullable: true})
    fee!: bigint | undefined | null

    /**
     * Статус транзакции (в очереди, выполнена, отменена и т.д.)
     */
    @Index_()
    @StringColumn_({nullable: false})
    status!: string

    /**
     * Тип транзакции (перевод, вызов контракта и т.д.)
     */
    @StringColumn_({nullable: true})
    type!: string | undefined | null

    /**
     * Данные транзакции в формате JSON
     */
    @StringColumn_({nullable: true})
    data!: string | undefined | null
}
