export const idlFactory = ({ IDL }) => {
  const VoteArgs = IDL.Record({
    'support' : IDL.Bool,
    'proposalId' : IDL.Nat64,
  });
  const CreateProposalArgs = IDL.Record({
    'durationInDays' : IDL.Nat64,
    'title' : IDL.Text,
    'description' : IDL.Text,
  });
  const Proposal = IDL.Record({
    'id' : IDL.Nat64,
    'status' : IDL.Text,
    'title' : IDL.Text,
    'creator' : IDL.Principal,
    'votesAgainst' : IDL.Nat64,
    'votesFor' : IDL.Nat64,
    'description' : IDL.Text,
    'deadline' : IDL.Nat64,
  });
  return IDL.Service({
    'castVote' : IDL.Func([VoteArgs], [IDL.Bool], []),
    'createProposal' : IDL.Func([CreateProposalArgs], [IDL.Nat64], []),
    'getActiveProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'getProposal' : IDL.Func([IDL.Nat64], [IDL.Opt(Proposal)], ['query']),
    'hasVoted' : IDL.Func([IDL.Nat64, IDL.Principal], [IDL.Bool], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
