import {
  ExhibitOrganized as ExhibitOrganizedEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/EventOrganizerService/EventOrganizerService"
import { ExhibitOrganized, OwnershipTransferred } from "../generated/schema"

export function handleExhibitOrganized(event: ExhibitOrganizedEvent): void {
  let entity = new ExhibitOrganized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.exhibitId = event.params.exhibitId
  entity.exhibitAddress = event.params.exhibitAddress
  entity.escrowAddress = event.params.escrowAddress

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
