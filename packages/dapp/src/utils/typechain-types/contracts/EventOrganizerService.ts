/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface EventOrganizerServiceInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "exhibits"
      | "museum"
      | "organizeExhibit"
      | "owner"
      | "renounceOwnership"
      | "transferOwnership"
      | "usdcToken"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "ExhibitOrganized" | "OwnershipTransferred"
  ): EventFragment;

  encodeFunctionData(functionFragment: "exhibits", values: [string]): string;
  encodeFunctionData(functionFragment: "museum", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "organizeExhibit",
    values: [
      string,
      string,
      string,
      BigNumberish,
      AddressLike[],
      BigNumberish[]
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "usdcToken", values?: undefined): string;

  decodeFunctionResult(functionFragment: "exhibits", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "museum", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "organizeExhibit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "usdcToken", data: BytesLike): Result;
}

export namespace ExhibitOrganizedEvent {
  export type InputTuple = [
    exhibitId: string,
    exhibitAddress: AddressLike,
    escrowAddress: AddressLike
  ];
  export type OutputTuple = [
    exhibitId: string,
    exhibitAddress: string,
    escrowAddress: string
  ];
  export interface OutputObject {
    exhibitId: string;
    exhibitAddress: string;
    escrowAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface EventOrganizerService extends BaseContract {
  connect(runner?: ContractRunner | null): EventOrganizerService;
  waitForDeployment(): Promise<this>;

  interface: EventOrganizerServiceInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  exhibits: TypedContractMethod<[arg0: string], [string], "view">;

  museum: TypedContractMethod<[], [string], "view">;

  organizeExhibit: TypedContractMethod<
    [
      exhibitId: string,
      name: string,
      symbol: string,
      ticketPrice: BigNumberish,
      beneficiaries: AddressLike[],
      shares: BigNumberish[]
    ],
    [void],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  usdcToken: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "exhibits"
  ): TypedContractMethod<[arg0: string], [string], "view">;
  getFunction(
    nameOrSignature: "museum"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "organizeExhibit"
  ): TypedContractMethod<
    [
      exhibitId: string,
      name: string,
      symbol: string,
      ticketPrice: BigNumberish,
      beneficiaries: AddressLike[],
      shares: BigNumberish[]
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "usdcToken"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "ExhibitOrganized"
  ): TypedContractEvent<
    ExhibitOrganizedEvent.InputTuple,
    ExhibitOrganizedEvent.OutputTuple,
    ExhibitOrganizedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "ExhibitOrganized(string,address,address)": TypedContractEvent<
      ExhibitOrganizedEvent.InputTuple,
      ExhibitOrganizedEvent.OutputTuple,
      ExhibitOrganizedEvent.OutputObject
    >;
    ExhibitOrganized: TypedContractEvent<
      ExhibitOrganizedEvent.InputTuple,
      ExhibitOrganizedEvent.OutputTuple,
      ExhibitOrganizedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}
