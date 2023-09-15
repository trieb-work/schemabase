import braintree, { Transaction } from "braintree";
import { Readable } from "stream";

type Config = {
    merchantId: string;
    publicKey: string;
    privateKey: string;
    sandbox: boolean;
};

export type BraintreeTransaction = Transaction;

export class BraintreeClient {
    private merchantId: string;

    private publicKey: string;

    private privateKey: string;

    private gateway: braintree.BraintreeGateway;

    public sandbox: boolean;

    constructor(config: Config) {
        this.merchantId = config.merchantId;
        this.publicKey = config.publicKey;
        this.privateKey = config.privateKey;
        this.sandbox = config.sandbox;
        this.gateway = new braintree.BraintreeGateway({
            environment: this.sandbox
                ? braintree.Environment.Sandbox
                : braintree.Environment.Production,
            merchantId: this.merchantId,
            publicKey: this.publicKey,
            privateKey: this.privateKey,
        });
    }

    getTransaction = async (transactionId: string) => {
        const details = await this.gateway.transaction.find(transactionId);
        return details as braintree.Transaction;
    };

    listTransactions = async ({
        createdAfter,
    }: {
        createdAfter: Date;
    }): Promise<braintree.Transaction[]> => {
        return new Promise<braintree.Transaction[]>((resolve, reject) => {
            const stream = this.listTransactionStream({ createdAfter });
            const dataArr: braintree.Transaction[] = [];
            stream.on("data", (transaction) => {
                dataArr.push(transaction);
            });
            stream.on("end", () => {
                resolve(dataArr);
            });
            stream.on("error", (err) => {
                reject(new Error("Stream errored:" + err));
            });
        });
    };

    listTransactionStream({ createdAfter }: { createdAfter: Date }): Readable {
        return this.gateway.transaction.search((search) => {
            search.createdAt().min(createdAfter);
        });
    }
}
