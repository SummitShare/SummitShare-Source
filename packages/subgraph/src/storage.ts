import {
  ContractFunded as ContractFundedEvent,
  FundsSentToRevenueSharing as FundsSentToRevenueSharingEvent
} from "../generated/Storage/Storage"
import { ContractFunded, FundsSentToRevenueSharing } from "../generated/schema"

export function handleContractFunded(event: ContractFundedEvent): void {
  let entity = new ContractFunded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.funder = event.params.funder
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundsSentToRevenueSharing(
  event: FundsSentToRevenueSharingEvent
): void {
  let entity = new FundsSentToRevenueSharing(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
