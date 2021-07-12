import * as driver from 'bigchaindb-driver'
import type {
    TransactionOperations,
  } from 'bigchaindb-driver/types/transaction';

export default class Bigchain{
    conn: driver.Connection;

    constructor(){
        this.conn = new driver.Connection('https://test.ipdb.io/api/v1/')
    }

    generateKeyPair():driver.Ed25519Keypair{
        return new driver.Ed25519Keypair()
    }
   
    createAsset(assetdata:any,metadata:any,publicKey:string,privateKey:string):Promise<any>{
        const txCreate = driver.Transaction.makeCreateTransaction(
            assetdata,
            metadata,
            [
                driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(publicKey))
            ],
            publicKey
        )
        
        const txCreateSigned =
            driver.Transaction.signTransaction(txCreate, privateKey)
        return this.conn.postTransactionCommit(txCreateSigned)
    }

    transferAsset(fetchedTx:any,metadata:any,privateKey:string,destinationPulicKey:string):Promise<any>{
        const txTransfer = driver.Transaction.makeTransferTransaction(
            [{ tx: fetchedTx, output_index: 0 }],
            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(destinationPulicKey))],
            metadata
        )

        const txTransferSigned= driver.Transaction.signTransaction(txTransfer, privateKey)

        return this.conn.postTransactionCommit(txTransferSigned)
    }

    updateAssetRecord(fetchedTx:any,metadata:any,publicKey:string,privateKey:string):Promise<any>{
        const txTransfer = driver.Transaction.makeTransferTransaction(
            [{ tx: fetchedTx, output_index: 0 }],
            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(publicKey))],
            metadata
        )

        const txTransferSigned= driver.Transaction.signTransaction(txTransfer, privateKey)

        return this.conn.postTransactionCommit(txTransferSigned)
    }

    getTransactions(assetId:string,operation?:TransactionOperations):Promise<any>{
        return this.conn.listTransactions(assetId,operation)
    }

    detailTransaction(assetId:string):Promise<any>{
        return this.conn.getTransaction(assetId)
    }

}
