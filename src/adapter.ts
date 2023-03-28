import {
  AllPermissionsType,
  MartianApis,
  Permission,
  SignAndExecuteBlockInput,
  SignMessageResponseType,
} from "./types";
import {
  Wallet,
  SUI_DEVNET_CHAIN,
  SUI_TESTNET_CHAIN,
  IdentifierArray,
  WalletAccount,
  SuiSignAndExecuteTransactionBlockOutput,
} from "@mysten/wallet-standard";
import { WalletVersion } from "@wallet-standard/base";
import {
  SuiTransactionBlockResponseOptions,
  TransactionBlock,
} from "@mysten/sui.js";
import { ConnectOutput } from "@wallet-standard/features";

export class MartianWalletAdapter implements Wallet {
  chains: IdentifierArray = [SUI_DEVNET_CHAIN, SUI_TESTNET_CHAIN];
  name = "Martian Sui Wallet";
  connecting: boolean = false;
  connected: boolean = false;
  wallet: MartianApis | null = null;
  #accounts: WalletAccount[] = [];

  get icon(): any {
    return "https://cdn.martianwallet.xyz/assets/icon.png";
  }

  get accounts(): WalletAccount[] {
    return this.#accounts;
  }

  get version() {
    // Return the version of the Wallet Standard this implements (in this case, 1.0.0).
    return "1.0.0" as WalletVersion;
  }

  get features() {
    return {
      "standard:connect": {
        version: "1.0.0",
        connect: async () => {
          const resp: ConnectOutput = await this.connect();
          this.#accounts = resp.accounts as WalletAccount[];
          return resp;
        },
      },
      "standard:events": {
        version: "1.0.0",
        on: () => this.on(),
      },
      "sui:signAndExecuteTransactionBlock": {
        version: "1.0.0",
        signAndExecuteTransactionBlock: async (
          input: SignAndExecuteBlockInput
        ) => await this.signAndExecuteTransactionBlock(input),
      },
    };
  }

  on() {
    // Not implemented
    return () => {};
  }

  @ensureWalletExist()
  async hasPermissions(permissions: AllPermissionsType): Promise<boolean> {
    const wallet = this.wallet as MartianApis;
    const hasPermission = await wallet.hasPermissions(permissions);
    return hasPermission;
  }

  @ensureWalletExist()
  async connect(): Promise<ConnectOutput> {
    const wallet = this.wallet as MartianApis;
    const connectResp = await wallet.connect([
      Permission.VIEW_ACCOUNT,
      Permission.SUGGEST_TX,
    ]);
    const acc: WalletAccount = {
      address: connectResp.address,
      publicKey: new TextEncoder().encode(connectResp.publicKey),
      chains: [SUI_DEVNET_CHAIN, SUI_TESTNET_CHAIN],
      features: [
        "standard:connect",
        "standard:events",
        "sui:signAndExecuteTransaction",
      ],
    };
    const accArr: WalletAccount[] = [acc];
    const x: ConnectOutput = {
      accounts: accArr,
    };
    return x;
  }

  @ensureWalletExist()
  async signAndExecuteTransactionBlock(
    input: SignAndExecuteBlockInput
  ): Promise<SuiSignAndExecuteTransactionBlockOutput> {
    const wallet = this.wallet as MartianApis;
    const data = await wallet.signAndExecuteTransactionBlock({
      transactionBlockSerialized: input.transactionBlock.serialize(),
      options: input.options,
    });
    return data as SuiSignAndExecuteTransactionBlockOutput;
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
  async signMessage(
    input: Uint8Array | string
  ): Promise<SignMessageResponseType> {
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
  throw new Error("You need to install Martian Extension from Chrome Store");
}

function ensureWalletExist() {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = (...args: any[]) => {
      if (!(window as any).martian) {
        return guideToInstallExtension();
      }
      if (!target.wallet) {
        target.wallet = (window as any).martian.sui;
      }
      return method.apply(target, args);
    };
    return descriptor;
  };
}
