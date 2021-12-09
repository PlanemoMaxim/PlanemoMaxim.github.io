import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

type WindowWithEthereum = Window & typeof globalThis & { ethereum?: any };

const CHAIN_IDS = 0x2328;
const EvmosParams = {
  chainId: "0x2328",
  chainName: "Evmos Testnet",
  nativeCurrency: {
    name: "PHOTON",
    symbol: "PHOTON",
    decimals: 18,
  },
  rpcUrls: [
    "https://evmos-testnet.gateway.pokt.network/v1/lb/61ac07b995d548003aedf5ee",
  ],
  blockExplorerUrls: ["https://evm.evmos.org"],
};

const injected = new InjectedConnector({ supportedChainIds: [CHAIN_IDS] });

const MetamaskContext = React.createContext({});

const MetamaskProvider: React.FC<{}> = ({ children }) => {
  const {
    active: isMetaMaskActive,
    error: networkError,
    activate,
  } = useWeb3React();

  const [userConnected, setUserConnected] = useState(false);

  const onError = (err: any) => {
    console.error(err);
    //console.log(isMetaMaskActive);
    //debugger;
  };

  useEffect(() => {
    console.log("Metamask activeveveve: " + isMetaMaskActive);
    console.log(networkError);
  }, [isMetaMaskActive, networkError, activate]);

  const activateMetamask = () => {
    console.log("activateMetamask run");
    activate(injected, onError, true).catch((err) => {
      console.error(err);
      switchEthereumChain();
      //debugger;
    });
  };

  if (!isMetaMaskActive) {
    activate(injected, onError, true).catch((err) => {
      console.error(err);
      //debugger;
    });
  }

  const switchEthereumChain = async () => {
    //debugger;
    try {
      await (window as WindowWithEthereum).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_IDS }],
      });
    } catch (switchError: any) {
      console.warn("switchError", switchError);
      // This error code indicates that the chain has not been added to MetaMask.
      // if (switchError.code === 4902) {
      try {
        await (window as WindowWithEthereum).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [EvmosParams],
        });
      } catch (addError) {
        // handle "add" error
      }
      // }
      // handle other "switch" errors
    }
  };

  return (
    <MetamaskContext.Provider
      value={{
        isMetaMaskActive,
        activateMetamask,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};

function useMetamask(): any {
  const context = React.useContext(MetamaskContext);
  if (context === undefined) {
    throw new Error("useMetamask must be used within a MetamaskProvider");
  }
  return context;
}

export { MetamaskProvider, useMetamask };

export default MetamaskProvider;
