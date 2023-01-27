import {
  MoveCallTransaction,
  CertifiedTransaction,
  SignableTransaction,
  SuiCertifiedTransactionEffects,
} from "@mysten/sui.js";

export type ConnectResponseType = {
  address: string;
  id: number;
  method: string;
  publicKey: string;
  status: number;
  tabId: number;
};

export type SignMessageResponseType = {
  signature: Uint8Array;
  signedMessage: Uint8Array;
};

export type GetAccountsType = Array<string>;

export type AllPermissionsType = ["viewAccount", "suggestTransactions"];
export enum Permission {
  VIEW_ACCOUNT = "viewAccount",
  SUGGEST_TX = "suggestTransactions",
}

export type WalletTxnResponse = {
  EffectsCert: {
    certificate: CertifiedTransaction;
    effects: SuiCertifiedTransactionEffects;
  };
};

export interface MartianApis {
  connect: (perms: Permission[]) => Promise<ConnectResponseType>;
  getAccounts: () => Promise<GetAccountsType>;
  executeMoveCall: (
    transaction: MoveCallTransaction
  ) => Promise<WalletTxnResponse>;
  disconnect: () => Promise<void>;
  signMessage: (input: Uint8Array | string) => Promise<SignMessageResponseType>;
  getPublicKey: () => Promise<string>;
  hasPermissions: (permissions: AllPermissionsType) => Promise<boolean>;
  signAndExecuteTransaction: (
    transaction: SignableTransaction
  ) => Promise<WalletTxnResponse>;
}
