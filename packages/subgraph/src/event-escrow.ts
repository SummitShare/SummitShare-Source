import { PaymentDistributed as PaymentDistributedEvent } from "../generated/EventEscrow/EventEscrow"
import { PaymentDistributed } from "../generated/schema"

export function handlePaymentDistributed(event: PaymentDistributedEvent): void {
  let entity = new PaymentDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beneficiary = event.params.beneficiary
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
