pragma solidity ^0.8.0;

contract Ballot {
    bytes32 public name;
    string public description;

    struct Proposal {
        bytes32 name; //name of the option
        uint votesCount; //total votes
    }

    struct Voter {
        bool voted;
        uint proposal;
    }

    mapping(address => Voter) public voters;
    Proposal[] public proposals;

    address creator;

    event Voted(uint indexed proposalId, address indexed voter);

    modifier proposalExists(uint proposalId) {
        _proposalCheck(proposalId);
        _;
    }

    function _proposalCheck(uint proposalId) internal view {
        require(proposalId < proposals.length, "No such proposal");
    }

    constructor(bytes32 ballotName, string memory ballotDescription, bytes32[] memory proposalNames) public {
        creator = msg.sender;

        name = ballotName;
        description = ballotDescription;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                votesCount: 0
            }));
        }
    }

    function vote(uint proposal) public proposalExists(proposal) {
        Voter storage voter = voters[msg.sender];
        require(!voter.voted, "Already voted.");
        voter.voted = true;
        voter.proposal = proposal;
        proposals[proposal].votesCount += 1;

        emit Voted(proposal, msg.sender);
    }

    function getMyVote() public view returns (bool, uint) {
        Voter storage voter = voters[msg.sender];
        return (voter.voted, voter.proposal);
    }

    function getProposalName(uint proposal) public view proposalExists(proposal) returns (bytes32) {
        return proposals[proposal].name;
    }

    function getProposalVotes(uint proposal) public view proposalExists(proposal) returns (uint) {
        return proposals[proposal].votesCount;
    }

    function getProposal(uint proposal) public view proposalExists(proposal) returns (bytes32, uint) {
        return (proposals[proposal].name, proposals[proposal].votesCount);
    }

    function getVotes() public view returns (uint[] memory) {
        uint[] memory votes = new uint[](proposals.length);
        for (uint i = 0; i < proposals.length; i++) {
            votes[i] = proposals[i].votesCount;
        }
        return votes;
    }

    function getProposalsCount() public view returns (uint) {
        return proposals.length;
    }
}

