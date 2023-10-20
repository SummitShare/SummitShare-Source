import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ContractFunded,
  FundsSentToRevenueSharing
} from "../generated/Storage/Storage"

export function createContractFundedEvent(
  funder: Address,
  amount: BigInt
): ContractFunded {
  let contractFundedEvent = changetype<ContractFunded>(newMockEvent())

  contractFundedEvent.parameters = new Array()

  contractFundedEvent.parameters.push(
    new ethereum.EventParam("funder", ethereum.Value.fromAddress(funder))
  )
  contractFundedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return contractFundedEvent
}

export function createFundsSentToRevenueSharingEvent(
  amount: BigInt
): FundsSentToRevenueSharing {
  let fundsSentToRevenueSharingEvent = changetype<FundsSentToRevenueSharing>(
    newMockEvent()
  )

  fundsSentToRevenueSharingEvent.parameters = new Array()

  fundsSentToRevenueSharingEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return fundsSentToRevenueSharingEvent
}
