import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CreateProposalArgs {
  'durationInDays' : bigint,
  'title' : string,
  'description' : string,
}
export interface Proposal {
  'id' : bigint,
  'status' : string,
  'title' : string,
  'creator' : Principal,
  'votesAgainst' : bigint,
  'votesFor' : bigint,
  'description' : string,
  'deadline' : bigint,
}
export interface VoteArgs { 'support' : boolean, 'proposalId' : bigint }
export interface _SERVICE {
  'castVote' : ActorMethod<[VoteArgs], boolean>,
  'createProposal' : ActorMethod<[CreateProposalArgs], bigint>,
  'getActiveProposals' : ActorMethod<[], Array<Proposal>>,
  'getProposal' : ActorMethod<[bigint], [] | [Proposal]>,
  'hasVoted' : ActorMethod<[bigint, Principal], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
