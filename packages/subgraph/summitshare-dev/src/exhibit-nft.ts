import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  ExhibitCreated as ExhibitCreatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TicketMinted as TicketMintedEvent,
  Transfer as TransferEvent
} from "../generated/ExhibitNFT/ExhibitNFT"
import {
  Approval,
  ApprovalForAll,
  Exhibit,
  ExhibitCreated,
  OwnershipTransferred,
  Ticket,
  TicketMinted,
  Transfer
} from "../generated/schema"

import { BigInt } from "@graphprotocol/graph-ts"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExhibitCreated(event: ExhibitCreatedEvent): void {
  let entity = new ExhibitCreated(
    event.address.concatI32(event.logIndex.toI32())
  )
  entity.name = event.params.name
  entity.symbol = event.params.symbol
  entity.ticketPrice = event.params.ticketPrice
  entity.escrow = event.params.escrow
  entity.owner = event.params.owner
  entity.baseURI = event.params.baseURI
  entity.location = event.params.location
  entity.collection = event.params.artifactNFTAddress.toHexString()
  entity.details = event.params.details

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.exhibit = event.address.toHexString()
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

export function handleTicketMinted(event: TicketMintedEvent): void {
  let entity = new TicketMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.exhibit = event.params.exhibit.toHexString()
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.ticket = event.params.exhibit.toHexString().concat("-").concat(event.params.tokenId.toString())

  entity.save()
}
  

export function handleTransfer(event: TransferEvent): void {
  let ticket = Ticket.load(event.address.toHexString().concat("-").concat(event.params.tokenId.toString()))
  if (ticket) {
    ticket.buyer = event.params.to
    ticket.save()
  }
}
