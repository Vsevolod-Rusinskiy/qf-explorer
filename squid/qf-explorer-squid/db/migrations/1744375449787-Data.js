module.exports = class Data1744375449787 {
    name = 'Data1744375449787'

    async up(db) {
        await db.query(`CREATE TABLE "block" ("id" character varying NOT NULL, "hash" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "validator" text, "status" text, "size" integer, CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_f8fba63d7965bfee9f304c487a" ON "block" ("hash") `)
        await db.query(`CREATE INDEX "IDX_5c67cbcf4960c1a39e5fe25e87" ON "block" ("timestamp") `)
        await db.query(`CREATE TABLE "transaction" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "amount" numeric, "fee" numeric, "status" text NOT NULL, "type" text, "data" text, "block_id" character varying, "from_id" character varying, "to_id" character varying, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c0e1460f3c9eee975fee81002d" ON "transaction" ("block_id") `)
        await db.query(`CREATE INDEX "IDX_2d99bb5a0ab5fb8cf8b746eb39" ON "transaction" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_87f2932d4a558d44a2915f849a" ON "transaction" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_99298f25613c7c4d7c8a77f9a4" ON "transaction" ("from_id") `)
        await db.query(`CREATE INDEX "IDX_7de44fdf7c9e64d9fd4b8a1de3" ON "transaction" ("to_id") `)
        await db.query(`CREATE INDEX "IDX_3d2f0eaf92e7df2babd1694095" ON "transaction" ("amount") `)
        await db.query(`CREATE INDEX "IDX_63f749fc7f7178ae1ad85d3b95" ON "transaction" ("status") `)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "balance" numeric, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "statistics" ("id" character varying NOT NULL, "total_blocks" integer NOT NULL, "total_transactions" integer NOT NULL, "total_accounts" integer NOT NULL, "average_block_time" numeric NOT NULL, "last_block" integer NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_c3769cca342381fa827a0f246a7" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_c0e1460f3c9eee975fee81002dc" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_99298f25613c7c4d7c8a77f9a40" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_7de44fdf7c9e64d9fd4b8a1de36" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "block"`)
        await db.query(`DROP INDEX "public"."IDX_f8fba63d7965bfee9f304c487a"`)
        await db.query(`DROP INDEX "public"."IDX_5c67cbcf4960c1a39e5fe25e87"`)
        await db.query(`DROP TABLE "transaction"`)
        await db.query(`DROP INDEX "public"."IDX_c0e1460f3c9eee975fee81002d"`)
        await db.query(`DROP INDEX "public"."IDX_2d99bb5a0ab5fb8cf8b746eb39"`)
        await db.query(`DROP INDEX "public"."IDX_87f2932d4a558d44a2915f849a"`)
        await db.query(`DROP INDEX "public"."IDX_99298f25613c7c4d7c8a77f9a4"`)
        await db.query(`DROP INDEX "public"."IDX_7de44fdf7c9e64d9fd4b8a1de3"`)
        await db.query(`DROP INDEX "public"."IDX_3d2f0eaf92e7df2babd1694095"`)
        await db.query(`DROP INDEX "public"."IDX_63f749fc7f7178ae1ad85d3b95"`)
        await db.query(`DROP TABLE "account"`)
        await db.query(`DROP TABLE "statistics"`)
        await db.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_c0e1460f3c9eee975fee81002dc"`)
        await db.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_99298f25613c7c4d7c8a77f9a40"`)
        await db.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_7de44fdf7c9e64d9fd4b8a1de36"`)
    }
}
