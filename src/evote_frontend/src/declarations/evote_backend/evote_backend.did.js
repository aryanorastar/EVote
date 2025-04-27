export const idlFactory = ({ IDL }) => {
  const CreateProposalArgs = IDL.Record({
    'title' : IDL.Text,
    'description' : IDL.Text,
    'durationInDays' : IDL.Nat64,
  });
  const VoteArgs = IDL.Record({
    'proposalId' : IDL.Nat64,
    'support' : IDL.Bool,
  });
  const Proposal = IDL.Record({
    'id' : IDL.Nat64,
    'title' : IDL.Text,
    'description' : IDL.Text,
    'deadline' : IDL.Nat64,
    'votesFor' : IDL.Nat64,
    'votesAgainst' : IDL.Nat64,
    'status' : IDL.Text,
    'creator' : IDL.Principal,
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
