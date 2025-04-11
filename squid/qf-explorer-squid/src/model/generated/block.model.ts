import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Transaction} from "./transaction.model"

@Entity_()
export class Block {
    constructor(props?: Partial<Block>) {
        Object.assign(this, props)
    }

    /**
     * Номер блока
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Хеш блока
     */
    @Index_()
    @StringColumn_({nullable: false})
    hash!: string

    /**
     * Временная метка создания блока
     */
    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    /**
     * Валидатор, создавший блок
     */
    @StringColumn_({nullable: true})
    validator!: string | undefined | null

    /**
     * Статус блока (в процессе, финализирован и т.д.)
     */
    @StringColumn_({nullable: true})
    status!: string | undefined | null

    /**
     * Размер блока в байтах
     */
    @IntColumn_({nullable: true})
    size!: number | undefined | null

    /**
     * Транзакции в этом блоке
     */
    @OneToMany_(() => Transaction, e => e.block)
    transactions!: Transaction[]
}
