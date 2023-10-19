import { FundsDistributed as FundsDistributedEvent } from "../generated/RevenueSharing/RevenueSharing"
import { FundsDistributed } from "../generated/schema"

export function handleFundsDistributed(event: FundsDistributedEvent): void {
  let entity = new FundsDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.rs2Share = event.params.rs2Share
  entity.rs3Share = event.params.rs3Share

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
