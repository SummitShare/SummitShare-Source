import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ExhibitCurated,
  MuseumCreated,
  OwnershipTransferred,
  TicketPurchased
} from "../generated/Museum/Museum"

export function createExhibitCuratedEvent(
  museumAddress: Address,
  exhibitId: string,
  exhibitAddress: Address
): ExhibitCurated {
  let exhibitCuratedEvent = changetype<ExhibitCurated>(newMockEvent())

  exhibitCuratedEvent.parameters = new Array()

  exhibitCuratedEvent.parameters.push(
    new ethereum.EventParam(
      "museumAddress",
      ethereum.Value.fromAddress(museumAddress)
    )
  )
  exhibitCuratedEvent.parameters.push(
    new ethereum.EventParam("exhibitId", ethereum.Value.fromString(exhibitId))
  )
  exhibitCuratedEvent.parameters.push(
    new ethereum.EventParam(
      "exhibitAddress",
      ethereum.Value.fromAddress(exhibitAddress)
    )
  )

  return exhibitCuratedEvent
}

export function createMuseumCreatedEvent(
  museumAddress: Address,
  tokenAddress: Address,
  ownerAddress: Address
): MuseumCreated {
  let museumCreatedEvent = changetype<MuseumCreated>(newMockEvent())

  museumCreatedEvent.parameters = new Array()

  museumCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "museumAddress",
      ethereum.Value.fromAddress(museumAddress)
    )
  )
  museumCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  museumCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "ownerAddress",
      ethereum.Value.fromAddress(ownerAddress)
    )
  )

  return museumCreatedEvent
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
