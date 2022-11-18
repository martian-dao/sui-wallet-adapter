## Martian Sui Wallet Adapter
---

To get started first install the npm package for the Martian Sui wallet adapter

```
npm install @martianwallet/sui-wallet-adapter
```

At the root of your application, you can then set up the Martian Sui wallet adapter:

```
import { WalletProvider } from "@mysten/wallet-adapter-react";
import {MartianWalletAdapter} from "@martianwallet/sui-wallet-adapter";

export function App() {
  const adapters = useMemo(() => [
    // Add support for all wallets that adhere to the Wallet Standard:
    new MartianWalletAdapter(),
  ], []);

  return (
    <WalletProvider adapters={adapters}>
      {/* Your application... */}
    </WalletProvider>
  );
}
```
