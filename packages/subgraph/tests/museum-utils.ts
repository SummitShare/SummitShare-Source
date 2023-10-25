import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ExhibitCurated,
  OwnershipTransferred,
  TicketPurchased
} from "../generated/Museum/Museum"

export function createExhibitCuratedEvent(exhibitId: string): ExhibitCurated {
  let exhibitCuratedEvent = changetype<ExhibitCurated>(newMockEvent())

  exhibitCuratedEvent.parameters = new Array()

  exhibitCuratedEvent.parameters.push(
    new ethereum.EventParam("exhibitId", ethereum.Value.fromString(exhibitId))
  )

  return exhibitCuratedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTicketPurchasedEvent(
  buyer: Address,
  exhibitId: string,
  tokenId: BigInt
): TicketPurchased {
  let ticketPurchasedEvent = changetype<TicketPurchased>(newMockEvent())

  ticketPurchasedEvent.parameters = new Array()

  ticketPurchasedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  ticketPurchasedEvent.parameters.push(
    new ethereum.EventParam("exhibitId", ethereum.Value.fromString(exhibitId))
  )
  ticketPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return ticketPurchasedEvent
}
