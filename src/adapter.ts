import { MoveCallTransaction, SuiTransactionResponse } from '@mysten/sui.js';
import { MartianApis, Permission, SignMessageResponseType } from './types';
import { Wallet, SUI_DEVNET_CHAIN, SUI_TESTNET_CHAIN, IdentifierArray, WalletAccount, ConnectOutput, SuiSignAndExecuteTransactionInput, SuiSignAndExecuteTransactionOutput } from "@mysten/wallet-standard";
import { WalletVersion, WalletIcon } from '@wallet-standard/base';

import {
  ConnectFeature,
  EventsFeature,
  EventsOnMethod,
  SuiSignAndExecuteTransactionFeature,
} from "@mysten/wallet-standard";

export class MartianWalletAdapter implements Wallet {
  icon!: WalletIcon;
  chains: IdentifierArray = [SUI_DEVNET_CHAIN, SUI_TESTNET_CHAIN];
  accounts: WalletAccount[] = [];
  name = 'Martian Sui Wallet';
  connecting: boolean = false;
  connected: boolean = false;
  wallet: MartianApis | null = null;

  get version() {
    // Return the version of the Wallet Standard this implements (in this case, 1.0.0).
    return "1.0.0" as WalletVersion;
  }

  get features(): ConnectFeature & EventsFeature & SuiSignAndExecuteTransactionFeature {
    return {
      "standard:connect": {
        version: "1.0.0",
        connect: this.connect,
      },
      "standard:events": {
        version: "1.0.0",
        on: this.on,
      },
      "sui:signAndExecuteTransaction": {
        version: "1.0.0",
        signAndExecuteTransaction: this.signAndExecuteTransaction,
      },
    };
  }

  on: EventsOnMethod = () => {
    // Your wallet's events on implementation.
    const x = () => { };
    return x;
  };

  @ensureWalletExist()
  async connect(): Promise<ConnectOutput> {
    // Your wallet's connect implementation
    const wallet = this.wallet as MartianApis;
    const { accounts } = await wallet.connect([Permission.VIEW_ACCOUNT, Permission.SUGGEST_TX]);
    const acc: WalletAccount = {
      address: accounts[0].address,
      publicKey: new TextEncoder().encode(accounts[0].publicKey),
      chains: [SUI_DEVNET_CHAIN, SUI_TESTNET_CHAIN],
      features: ["standard:connect", "standard:events", "sui:signAndExecuteTransaction"]
    }
    const accArr: WalletAccount[] = [acc];
    this.accounts = accArr;
    const x: ConnectOutput = {
      accounts: accArr
    };
    return x;
  };

  @ensureWalletExist()
  async signAndExecuteTransaction(transaction: SuiSignAndExecuteTransactionInput): Promise<SuiSignAndExecuteTransactionOutput> {
    // Your wallet's signAndExecuteTransaction implementation
    const wallet = this.wallet as MartianApis;
    return await wallet.signAndExecuteTransaction(transaction.transaction) as SuiSignAndExecuteTransactionOutput;
  };


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
  throw new Error('You need to install Martian Extension from Chrome Store');
}

function ensureWalletExist() {
  return (target: any,
    methodName: string,
    descriptor: PropertyDescriptor
  ) => {
    const method = descriptor.value;
    descriptor.value = (...args: any[]) => {
      if (!(window as any).martian) {
        return guideToInstallExtension();
      }
      if (!target.wallet) {
        target.wallet = (window as any).martian.sui;
      }
      return method.apply(target, args);
    }
    return descriptor;
  }
}
