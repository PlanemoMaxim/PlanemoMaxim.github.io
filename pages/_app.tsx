import React from "react";
import Head from "next/head";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider as EthersWeb3Provider } from "@ethersproject/providers";

import type { AppProps } from "next/app";

import "../styles/globals.css";

import MetamaskProvider from "../app/ConnectMetamask";
import ContractsProvider from "../app/ContractsProvider";
import Layout from "../components/Layout";

const TITLE = "Voting";
const DESCRIPTION = "Just a simple voting contract";

const ETHERS_POLLING_INTERVAL = 1000;

const getLibrary = (provider: any) => {
  const library = new EthersWeb3Provider(provider);
  library.pollingInterval = ETHERS_POLLING_INTERVAL;
  return library;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/logo.jpg" />
      </Head>

      <Web3ReactProvider getLibrary={getLibrary}>
        <MetamaskProvider>
          <ContractsProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ContractsProvider>
        </MetamaskProvider>
      </Web3ReactProvider>
    </>
  );
}
export default MyApp;
