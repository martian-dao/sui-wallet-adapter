import { MoveCallTransaction, SignableTransaction, SuiAddress, SuiTransactionResponse } from "@mysten/sui.js";
import { WalletAdapter } from "@mysten/wallet-adapter-base";

declare const window: {
    martian;
  };

export class MartianSuiWalletadapter implements WalletAdapter{
    name = 'Martian Sui Wallet';
    icon?: string;
    connected: boolean = false;
    connecting: boolean = false;
    wallet = window.martian.sui;

    async connect(): Promise<void>{
        return await this.wallet.connect();
    };
    async disconnect(): Promise<void>{
        return await this.wallet.disconnect();
    };

    /**
     * Suggest a transaction for the user to sign. Supports all valid transaction types.
     */
    async signAndExecuteTransaction(
        transaction: SignableTransaction
    ): Promise<SuiTransactionResponse>{
        return await this.wallet.signAndExecuteTransaction(transaction);
    };

    async executeMoveCall(
        transaction: MoveCallTransaction
    ): Promise<SuiTransactionResponse>{
        return await this.wallet.executeMoveCall(transaction);
    }

    // async signMessage(input): Promise<void>{
    //     return await this.signMessage(input);
    // }

    async getPublicKey(): Promise<void>{
        return await this.getPublicKey();
      }

    async getAccounts(): Promise<SuiAddress[]>{
        return await this.wallet.getAccounts();
    };
}