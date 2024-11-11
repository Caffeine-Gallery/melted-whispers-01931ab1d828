import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Time = bigint;
export interface _SERVICE {
  'getLocation' : ActorMethod<[string], [] | [string]>,
  'getMenu' : ActorMethod<[], Array<[string, string, bigint]>>,
  'getRemainingDays' : ActorMethod<[], bigint>,
  'isOperating' : ActorMethod<[], boolean>,
  'makeReservation' : ActorMethod<
    [string, string, bigint, Time],
    [] | [string]
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
