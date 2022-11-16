import { MoveCallTransaction, SuiTransactionResponse } from '@mysten/sui.js';
import { MartianApis, Permission, SignMessageResponseType } from './types';

declare const window: {
  martian: { sui: MartianApis };
};

export class MartianWalletAdapter {
  name = 'Martian Sui Wallet';
  connecting: boolean = false;
  connected: boolean = false;
  wallet: MartianApis | null = null;

  @ensureWalletExist()
  async connect(): Promise<void> {
    const wallet = this.wallet as MartianApis;
    const resData = await wallet.connect([Permission.VIEW_ACCOUNT, Permission.SUGGEST_TX]);
  }

  @ensureWalletExist()
  async disconnect(): Promise<void> {
    const wallet = this.wallet as MartianApis;
    await wallet.disconnect();
  }

  @ensureWalletExist()
  async getAccounts() {
    const wallet = this.wallet as MartianApis;
    return await wallet.getAccounts();
  }

  @ensureWalletExist()
  async executeMoveCall(transaction: MoveCallTransaction): Promise<SuiTransactionResponse> {
    const wallet = this.wallet as MartianApis;
    return await wallet.executeMoveCall(transaction);
  }

  @ensureWalletExist()
  async signAndExecuteTransaction(transaction: any): Promise<SuiTransactionResponse> {
    const wallet = this.wallet as MartianApis;
    return await wallet.signAndExecuteTransaction(transaction);
  }

  @ensureWalletExist()
  async signMessage(input: Uint8Array | string): Promise<SignMessageResponseType> {
    const wallet = this.wallet as MartianApis;
    return await wallet.signMessage(input);
  }

  @ensureWalletExist()
  async getPublicKey(): Promise<string> {
    const wallet = this.wallet as MartianApis;
    return await wallet.getPublicKey();
  }
}


function guideToInstallExtension() {
  throw new Error('You need to install Suiet Extension from Chrome Store firstly!');
}

function ensureWalletExist() {
  return (target: any,
    methodName: string,
    descriptor: PropertyDescriptor
  ) => {
    const method = descriptor.value;
    descriptor.value = (...args: any[]) => {
      if (!window.martian) {
        return guideToInstallExtension();
      }
      if (!target.wallet) {
        target.wallet = window.martian.sui;
      }
      return method.apply(target, args);
    }
    return descriptor;
  }
}
