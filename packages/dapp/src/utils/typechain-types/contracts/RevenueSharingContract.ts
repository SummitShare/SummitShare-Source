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

export interface RevenueSharingContractInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "controller"
      | "distributeFunds"
      | "initialize"
      | "ps"
      | "rs2"
      | "rs3"
      | "usdc"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "FundsDistributed"): EventFragment;

  encodeFunctionData(
    functionFragment: "controller",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "distributeFunds",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [AddressLike, AddressLike, AddressLike, BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "ps", values?: undefined): string;
  encodeFunctionData(functionFragment: "rs2", values?: undefined): string;
  encodeFunctionData(functionFragment: "rs3", values?: undefined): string;
  encodeFunctionData(functionFragment: "usdc", values?: undefined): string;

  decodeFunctionResult(functionFragment: "controller", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "distributeFunds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ps", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rs2", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rs3", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "usdc", data: BytesLike): Result;
}

export namespace FundsDistributedEvent {
  export type InputTuple = [rs2Share: BigNumberish, rs3Share: BigNumberish];
  export type OutputTuple = [rs2Share: bigint, rs3Share: bigint];
  export interface OutputObject {
    rs2Share: bigint;
    rs3Share: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface RevenueSharingContract extends BaseContract {
  connect(runner?: ContractRunner | null): RevenueSharingContract;
  waitForDeployment(): Promise<this>;

  interface: RevenueSharingContractInterface;

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

  controller: TypedContractMethod<[], [string], "view">;

  distributeFunds: TypedContractMethod<
    [amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  initialize: TypedContractMethod<
    [
      _controller: AddressLike,
      _rs2: AddressLike,
      _rs3: AddressLike,
      _ps: BigNumberish,
      _usdc: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  ps: TypedContractMethod<[], [bigint], "view">;

  rs2: TypedContractMethod<[], [string], "view">;

  rs3: TypedContractMethod<[], [string], "view">;

  usdc: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "controller"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "distributeFunds"
  ): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<
    [
      _controller: AddressLike,
      _rs2: AddressLike,
      _rs3: AddressLike,
      _ps: BigNumberish,
      _usdc: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(nameOrSignature: "ps"): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "rs2"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "rs3"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "usdc"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "FundsDistributed"
  ): TypedContractEvent<
    FundsDistributedEvent.InputTuple,
    FundsDistributedEvent.OutputTuple,
    FundsDistributedEvent.OutputObject
  >;

  filters: {
    "FundsDistributed(uint256,uint256)": TypedContractEvent<
      FundsDistributedEvent.InputTuple,
      FundsDistributedEvent.OutputTuple,
      FundsDistributedEvent.OutputObject
    >;
    FundsDistributed: TypedContractEvent<
      FundsDistributedEvent.InputTuple,
      FundsDistributedEvent.OutputTuple,
      FundsDistributedEvent.OutputObject
    >;
  };
}