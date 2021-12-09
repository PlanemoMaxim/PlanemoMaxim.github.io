import { useEffect, useState } from "react";
import { useMetamask } from "./ConnectMetamask";
import { useContracts } from "./ContractsProvider";
import Web3 from "web3";

interface Proposal {
  name: string;
  votesCount: number;
}

function useVoter() {
  const {
    contracts: { ballotContract },
    accountAddress,
  } = useContracts();
  const { isMetaMaskActive, activateMetamask } = useMetamask();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [proposals, setProposals] = useState<Array<Proposal>>([]);
  const [isLoading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [votedOption, setVotedOption] = useState(-1);

  function setBytesName(bytesName: string) {
    setName(Web3.utils.hexToAscii(bytesName));
  }

  function addProposal(pr: any) {
    const newProposal = {
      name: Web3.utils.hexToAscii(pr[0]),
      votesCount: pr[1],
    };
    setProposals((proposals) => [...proposals, newProposal]);
  }

  function updateVotedState(vt: any) {
    setVoted(vt[0]);
    setVotedOption(vt[1]);
  }

  const refresh = async () => {
    if (!(ballotContract && accountAddress)) {
      return;
    }

    if (!isMetaMaskActive) {
      await activateMetamask();
    }

    if (isLoading) {
      return;
    }
    setLoading(true);

    await ballotContract.methods
      .name()
      .call({ from: accountAddress })
      .then(setBytesName);

    await ballotContract.methods
      .description()
      .call({ from: accountAddress })
      .then(setDescription);

    await ballotContract.methods
      .getMyVote()
      .call({ from: accountAddress })
      .then(updateVotedState);

    var proposalsCount = 0;
    await ballotContract.methods
      .getProposalsCount()
      .call({ from: accountAddress })
      .then(function (count: number) {
        proposalsCount = count;
      });

    setProposals([]);
    console.log("Proposals count " + proposalsCount);
    for (var i = 0; i < proposalsCount; ++i) {
      console.log("Load proposal " + i);
      await ballotContract.methods
        .getProposal(i)
        .call({ from: accountAddress })
        .then(addProposal);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("Metamask active: " + isMetaMaskActive);

    refresh();
  }, [ballotContract, accountAddress, isMetaMaskActive, activateMetamask]);

  /*function replaceProposal(proposal: number) {
    ballotContract.methods
      .getProposal(proposal)
      .call({ from: accountAddress })
      .then(function (pr) {
        const newProposal = {
          name: Web3.utils.hexToAscii(pr[0]),
          votesCount: pr[1],
        };
      });
  }*/

  const makeVote = async (proposal: number) => {
    if (!(ballotContract && accountAddress)) {
      return;
    }

    if (!isMetaMaskActive) {
      await activateMetamask();
    }

    console.log("Proposal " + proposal);
    console.log(proposal);
    await ballotContract.methods
      .vote(proposal)
      .send({ from: accountAddress })
      .then(function (arg: Object) {
        refresh();
        console.log(arg);
      });
  };

  return { name, description, proposals, voted, votedOption, makeVote };
}

export default useVoter;
