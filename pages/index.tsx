import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useMetamask } from "../app/ConnectMetamask";
import { useRouter } from "next/dist/client/router";
import Web3 from "web3";
import { useContracts } from "../app/ContractsProvider";
import useVoter from "../app/useVoter";

function MainPage() {
  const { isMetaMaskActive, activateMetamask } = useMetamask();
  const { accountAddress } = useContracts();
  const router = useRouter();

  const [selectedProposal, setSelectedProposal] = useState(-1);
  const { name, description, proposals, voted, votedOption, makeVote } =
    useVoter();

  function connect() {
    activateMetamask();
  }

  function doVote() {
    if (selectedProposal >= 0) {
      makeVote(selectedProposal);
    } else {
    }
  }

  useEffect(() => {
    console.log("Main Metamask active: " + isMetaMaskActive);
  }, [isMetaMaskActive, activateMetamask]);

  return (
    <div className="bg-white">
      <button
        onClick={connect}
        className="block w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
      >
        Connect Metamask {accountAddress}
      </button>
      <p className="text-center">
        <small>If nothing happens - reload the page.</small>
      </p>
      {isMetaMaskActive ? (
        <>
          <div>
            <h2 className="text-center font-medium text-2xl">{name}</h2>
            <p className="text-center font-medium text-xl">{description}</p>
            <p className="text-center">
              <small>Choose proposal and click vote</small>
            </p>
            <ul className="text-center">
              {proposals.map((proposal, index) => (
                <li
                  className={`block shadow p-4 m-2  ${
                    index == selectedProposal ? "selected" : ""
                  } ${
                    voted && index == votedOption
                      ? "voted"
                      : "hover:bg-gray-100"
                  }`}
                  key={proposal["name"]}
                  onClick={() => {
                    if (!voted) {
                      if (selectedProposal == index) {
                        setSelectedProposal(-1);
                      } else {
                        setSelectedProposal(index);
                      }
                    }
                  }}
                >
                  {proposal["name"]} - {proposal["votesCount"]} votes
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={doVote}
            disabled={voted}
            className="disabled:opacity-75 block w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
          >
            {voted ? "Already voted" : "Vote"}
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default MainPage;
