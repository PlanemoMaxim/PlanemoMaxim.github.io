import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { provider } from "web3-core";

import { abi as ballotAbi } from "../contracts/Ballot.sol/Ballot.json";

import { useMetamask } from "./ConnectMetamask";

const ContractsContext = React.createContext({});

export interface Address {
  BALLOT_CONTRACT_ADDRESS: string;
}

const ADDRESS: Address = {
  BALLOT_CONTRACT_ADDRESS: "0xECF1CBD1A5A406A615c7D56B546C5e1697259e40",
};

interface Props {}

const ContractsProvider: React.FC<Props> = ({ children }) => {
  const { active, connector } = useWeb3React();
  const { isMetaMaskActive, activateMetamask } = useMetamask();
  const [web3Instance, setWeb3Instance] = useState<any>(null);
  const [accountAddress, setAccount] = useState<string>("");

  const [ballotContract, setBallotContract] = useState<any>(null);

  useEffect(() => {
    const getWeb3Instance = async () => {
      connector?.getProvider().then((provider: provider) => {
        const instance = new Web3(provider);
        setWeb3Instance(instance);
        window.ethereum.on("accountsChanged", function (accounts) {
          // Time to reload your interface with accounts[0]!
          setAccount(accounts[0]);
        });
      });
    };

    getWeb3Instance();
  }, [active, connector]);

  useEffect(() => {
    if (web3Instance === null) {
      setAccount("");
      return;
    }
    (web3Instance as Web3).eth.getAccounts((err, accounts: string[]) => {
      if (err) {
        debugger;
        console.error(err);
        setAccount("");
      } else {
        // console.log("accounts[0]", accounts[0]);
        setAccount(accounts[0]);
      }
    });
  }, [web3Instance]);

  // setup ballotContract
  useEffect(() => {
    if (web3Instance === null) {
      return;
    }
    if (!isMetaMaskActive) {
      activateMetamask();
      // console.log('Activating Metamask!')
    }

    const BallotContract = new (web3Instance as Web3).eth.Contract(
      ballotAbi as any,
      ADDRESS.BALLOT_CONTRACT_ADDRESS
    );
    setBallotContract(BallotContract);
  }, [web3Instance, isMetaMaskActive, activateMetamask]);

  return (
    <ContractsContext.Provider
      value={{
        accountAddress,
        web3Instance,
        address: ADDRESS,
        contracts: {
          ballotContract,
        },
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
};

function useContracts(): any {
  const context = React.useContext(ContractsContext);
  if (context === undefined) {
    throw new Error("useContracts must be used within a ContractsProvider");
  }
  return context;
}

export { ContractsProvider, useContracts };

export default ContractsProvider;
