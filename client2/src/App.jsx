import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  curtis,
  apeChain,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import Connect from './components/Connect';
import SendMessage from './components/SendMessage';


const config = getDefaultConfig({
  appName: 'My RainbowKit App', // CHANGE LATER , store in .env
  projectId: '6dd15a3684137adf8eb5ed126f061236',  // CHANGE LATER , store in .env
  chains: [mainnet, polygon, optimism, arbitrum, base, curtis, apeChain],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="full">
          <Connect />
          <SendMessage />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


export default App
