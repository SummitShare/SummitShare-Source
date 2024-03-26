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

export interface EventEscrowInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "beneficiaries"
      | "distributePayments"
      | "numBeneficiaries"
      | "payouts"
      | "totalShares"
      | "usdcToken"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "EventEscrowDeployed" | "PaymentDistributed"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "beneficiaries",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "distributePayments",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "numBeneficiaries",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "payouts",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "totalShares",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "usdcToken", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "beneficiaries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distributePayments",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numBeneficiaries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "payouts", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "usdcToken", data: BytesLike): Result;
}

export namespace EventEscrowDeployedEvent {
  export type InputTuple = [
    usdcToken: AddressLike,
    beneficiaries: AddressLike[],
    shares: BigNumberish[],
    numBeneficiaries: BigNumberish
  ];
  export type OutputTuple = [
    usdcToken: string,
    beneficiaries: string[],
    shares: bigint[],
    numBeneficiaries: bigint
  ];
  export interface OutputObject {
    usdcToken: string;
    beneficiaries: string[];
    shares: bigint[];
    numBeneficiaries: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PaymentDistributedEvent {
  export type InputTuple = [
    beneficiary: AddressLike,
    amount: BigNumberish,
    indexedcaller: AddressLike
  ];
  export type OutputTuple = [
    beneficiary: string,
    amount: bigint,
    indexedcaller: string
  ];
  export interface OutputObject {
    beneficiary: string;
    amount: bigint;
    indexedcaller: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface EventEscrow extends BaseContract {
  connect(runner?: ContractRunner | null): EventEscrow;
  waitForDeployment(): Promise<this>;

  interface: EventEscrowInterface;

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

  beneficiaries: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  distributePayments: TypedContractMethod<[], [void], "nonpayable">;

  numBeneficiaries: TypedContractMethod<[], [bigint], "view">;

  payouts: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  totalShares: TypedContractMethod<[], [bigint], "view">;

  usdcToken: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "beneficiaries"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "distributePayments"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "numBeneficiaries"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "payouts"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "totalShares"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "usdcToken"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "EventEscrowDeployed"
  ): TypedContractEvent<
    EventEscrowDeployedEvent.InputTuple,
    EventEscrowDeployedEvent.OutputTuple,
    EventEscrowDeployedEvent.OutputObject
  >;
  getEvent(
    key: "PaymentDistributed"
  ): TypedContractEvent<
    PaymentDistributedEvent.InputTuple,
    PaymentDistributedEvent.OutputTuple,
    PaymentDistributedEvent.OutputObject
  >;

  filters: {
    "EventEscrowDeployed(address,address[],uint256[],uint256)": TypedContractEvent<
      EventEscrowDeployedEvent.InputTuple,
      EventEscrowDeployedEvent.OutputTuple,
      EventEscrowDeployedEvent.OutputObject
    >;
    EventEscrowDeployed: TypedContractEvent<
      EventEscrowDeployedEvent.InputTuple,
      EventEscrowDeployedEvent.OutputTuple,
      EventEscrowDeployedEvent.OutputObject
    >;

    "PaymentDistributed(address,uint256,address)": TypedContractEvent<
      PaymentDistributedEvent.InputTuple,
      PaymentDistributedEvent.OutputTuple,
      PaymentDistributedEvent.OutputObject
    >;
    PaymentDistributed: TypedContractEvent<
      PaymentDistributedEvent.InputTuple,
      PaymentDistributedEvent.OutputTuple,
      PaymentDistributedEvent.OutputObject
    >;
  };
}
