import {
  SuiTransactionBlockResponseOptions,
  TransactionBlock,
} from "@mysten/sui.js";

import {
  SuiSignAndExecuteTransactionBlockOutput,
  SuiSignTransactionBlockOutput,
} from "@mysten/wallet-standard";

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

export type SignAndExecutePayload = {
  transactionBlockSerialized: string;
  options: any;
};

export type SignAndExecuteBlockInput = {
  transactionBlock: TransactionBlock;
  options: SuiTransactionBlockResponseOptions;
};

export type SignTransactionBlockInput = {
  transactionBlockSerialized: string;
};

export type GetAccountsType = Array<string>;

export type AllPermissionsType = ["viewAccount", "suggestTransactions"];
export enum Permission {
  VIEW_ACCOUNT = "viewAccount",
  SUGGEST_TX = "suggestTransactions",
}

export interface MartianApis {
  connect: (perms: Permission[]) => Promise<ConnectResponseType>;
  getAccounts: () => Promise<GetAccountsType>;
  disconnect: () => Promise<void>;
  signMessage: (input: Uint8Array | string) => Promise<SignMessageResponseType>;
  getPublicKey: () => Promise<string>;
  hasPermissions: (permissions: AllPermissionsType) => Promise<boolean>;
  signAndExecuteTransactionBlock: (
    payload: SignAndExecutePayload
  ) => Promise<SuiSignAndExecuteTransactionBlockOutput>;
  signTransactionBlock: (
    payload: SignTransactionBlockInput
  ) => Promise<SuiSignTransactionBlockOutput>;
}
