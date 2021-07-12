import {Ed25519Keypair,Connection,Transaction,ccJsonLoad,ccJsonify} from 'bigchaindb-driver'
import { Endpoints, EndpointsResponse } from 'bigchaindb-driver/types/connection';
import type {
    TransactionCommon,
    TransactionOperations,
  } from 'bigchaindb-driver/types/transaction';

class Bigchain{
    conn:Connection;

    constructor(){
        console.log("aa");
        this.conn = new Connection('https://test.ipdb.io/api/v1/')
    }

    generateKeyPair():Ed25519Keypair{
        return new Ed25519Keypair()
    }
   
    createAsset(assetdata:Record<string, any>,metadata:Record<string, any>,publicKey:string,privateKey:string):Promise<EndpointsResponse<TransactionOperations.CREATE,  Record<string, any>,  Record<string, any>>[Endpoints.transactionsCommit]>{
        const txCreate = Transaction.makeCreateTransaction(
            assetdata,
            metadata,
            [
                Transaction.makeOutput(Transaction.makeEd25519Condition(publicKey))
            ],
            publicKey
        )
        const txCreateSigned =
            Transaction.signTransaction(txCreate, privateKey)
        return this.conn.postTransactionCommit(txCreateSigned)
    }

    transferAsset(fetchedTx:TransactionCommon,metadata:Record<string, any>,privateKey:string,destinationPulicKey:string):Promise<EndpointsResponse<TransactionOperations.TRANSFER,  Record<string, any>,  Record<string, any>>[Endpoints.transactionsCommit]>{
        const txTransfer = Transaction.makeTransferTransaction(
            [{ tx: fetchedTx, output_index: 0 }],
            [Transaction.makeOutput(Transaction.makeEd25519Condition(destinationPulicKey))],
            metadata
        )

        const txTransferSigned= Transaction.signTransaction(txTransfer, privateKey)

        return this.conn.postTransactionCommit(txTransferSigned)
    }

    updateAssetRecord(fetchedTx:TransactionCommon,metadata:any,publicKey:string,privateKey:string):Promise<EndpointsResponse<TransactionOperations.TRANSFER,  Record<string, any>,  Record<string, any>>[Endpoints.transactionsCommit]>{
        const txTransfer = Transaction.makeTransferTransaction(
            [{ tx: fetchedTx, output_index: 0 }],
            [Transaction.makeOutput(Transaction.makeEd25519Condition(publicKey))],
            metadata
        )

        const txTransferSigned= Transaction.signTransaction(txTransfer, privateKey)

        return this.conn.postTransactionCommit(txTransferSigned)
    }

    getTransactions(assetId:string,operation?:TransactionOperations): Promise<EndpointsResponse<typeof operation>[Endpoints.transactions]>{
        return this.conn.listTransactions(assetId,operation)
    }

    detailTransaction(transactionId:string):Promise<EndpointsResponse<any>[Endpoints.transactionsDetail]>{
        return this.conn.getTransaction(transactionId)
    }

}

let bigchainInstance: Bigchain
const getBigchainInstance = () => {
  if (!bigchainInstance) {
    bigchainInstance = new Bigchain();
  }
  return bigchainInstance;
};

export const BigchainInstance = getBigchainInstance();