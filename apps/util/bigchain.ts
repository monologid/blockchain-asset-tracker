import {Ed25519Keypair,Connection,Transaction} from 'bigchaindb-driver'
import { Endpoints, EndpointsResponse } from 'bigchaindb-driver/types/connection';
import type {
    TransactionCommon,
    TransactionOperations,
  } from 'bigchaindb-driver/types/transaction';
import * as bip39 from 'bip39'

const conn_uri = process.env.BIGCHAINDB_URI || 'http://bigchaindb:9984/api/v1/'

class Bigchain{
    private conn:Connection;
    private static _instance:Bigchain;

    constructor(){
        this.conn = new Connection(conn_uri)
    }

    static get instance() {
        if(!this._instance){
            this._instance = new Bigchain();
        }
        return this._instance;
    }

    generateKeyPair():Ed25519Keypair{
        return new Ed25519Keypair()
    }

    async generateKeyPairFormPassphrase(passphrase:string):Promise<Ed25519Keypair>{
     
        const seed = await bip39.mnemonicToSeed(passphrase)
        return new Ed25519Keypair(seed.slice(0,32))
    }
   
   
    createAsset(assetdata:Record<string, any>,metadata:Record<string, any>, keypair:Ed25519Keypair):Promise<EndpointsResponse<TransactionOperations.CREATE,  Record<string, any>,  Record<string, any>>[Endpoints.transactionsCommit]>{
  
        const txCreate = Transaction.makeCreateTransaction(
            assetdata,
            metadata,
            [
                Transaction.makeOutput(Transaction.makeEd25519Condition(keypair.publicKey))
            ],
            keypair.publicKey
        )
   
        const txCreateSigned =
            Transaction.signTransaction(txCreate, keypair.privateKey)
           
        return this.conn.postTransactionCommit(txCreateSigned)
    }

    transferAsset(fetchedTx:TransactionCommon,metadata:Record<string, any>,keypair:Ed25519Keypair,destinationPulicKey:string):Promise<EndpointsResponse<TransactionOperations.TRANSFER,  Record<string, any>,  Record<string, any>>[Endpoints.transactionsCommit]>{
        const txTransfer = Transaction.makeTransferTransaction(
            [{ tx: fetchedTx, output_index: 0 }],
            [Transaction.makeOutput(Transaction.makeEd25519Condition(destinationPulicKey))],
            metadata
        )

        const txTransferSigned= Transaction.signTransaction(txTransfer, keypair.privateKey)

        return this.conn.postTransactionCommit(txTransferSigned)
    }

    updateAssetRecord(fetchedTx:TransactionCommon,metadata:any,keypair:Ed25519Keypair):Promise<EndpointsResponse<TransactionOperations.TRANSFER,  Record<string, any>,  Record<string, any>>[Endpoints.transactionsCommit]>{
        const txTransfer = Transaction.makeTransferTransaction(
            [{ tx: fetchedTx, output_index: 0 }],
            [Transaction.makeOutput(Transaction.makeEd25519Condition(keypair.publicKey))],
            metadata
        )

        const txTransferSigned= Transaction.signTransaction(txTransfer,keypair.privateKey)

        return this.conn.postTransactionCommit(txTransferSigned)
    }

    getTransactions(assetId:string,operation?:TransactionOperations): Promise<EndpointsResponse<typeof operation>[Endpoints.transactions]>{
        return this.conn.listTransactions(assetId,operation)
    }

    detailTransaction(transactionId:string):Promise<EndpointsResponse<any>[Endpoints.transactionsDetail]>{
        return this.conn.getTransaction(transactionId)
    }

}

export const BigchainInstance = Bigchain.instance;