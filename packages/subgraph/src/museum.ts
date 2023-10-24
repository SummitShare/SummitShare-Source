import {
  ExhibitCurated as ExhibitCuratedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TicketPurchased as TicketPurchasedEvent
} from "../generated/Museum/Museum"
import {
  ExhibitCurated,
  OwnershipTransferred,
  TicketPurchased
} from "../generated/schema"

export function handleExhibitCurated(event: ExhibitCuratedEvent): void {
  let entity = new ExhibitCurated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.exhibitId = event.params.exhibitId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTicketPurchased(event: TicketPurchasedEvent): void {
  let entity = new TicketPurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.buyer = event.params.buyer
  entity.exhibitId = event.params.exhibitId
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
