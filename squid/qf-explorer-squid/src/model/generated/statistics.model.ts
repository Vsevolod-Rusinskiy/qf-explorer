import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, FloatColumn as FloatColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Statistics {
    constructor(props?: Partial<Statistics>) {
        Object.assign(this, props)
    }

    /**
     * Уникальный идентификатор статистики (всегда 'current')
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Общее количество блоков
     */
    @IntColumn_({nullable: false})
    totalBlocks!: number

    /**
     * Общее количество транзакций
     */
    @IntColumn_({nullable: false})
    totalTransactions!: number

    /**
     * Общее количество аккаунтов
     */
    @IntColumn_({nullable: false})
    totalAccounts!: number

    /**
     * Среднее время между блоками (миллисекунды)
     */
    @FloatColumn_({nullable: false})
    averageBlockTime!: number

    /**
     * Последний обработанный блок
     */
    @IntColumn_({nullable: false})
    lastBlock!: number

    /**
     * Временная метка последнего обновления
     */
    @DateTimeColumn_({nullable: false})
    updatedAt!: Date
}
