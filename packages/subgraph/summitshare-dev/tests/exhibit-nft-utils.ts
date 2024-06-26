import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  ExhibitCreated,
  OwnershipTransferred,
  TicketMinted,
  Transfer
} from "../generated/ExhibitNFT/ExhibitNFT"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createExhibitCreatedEvent(
  name: string,
  symbol: string,
  ticketPrice: BigInt,
  escrow: Address,
  owner: Address,
  baseURI: string,
  location: string,
  artifactNFTAddress: Address,
  details: string
): ExhibitCreated {
  let exhibitCreatedEvent = changetype<ExhibitCreated>(newMockEvent())

  exhibitCreatedEvent.parameters = new Array()

  exhibitCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  exhibitCreatedEvent.parameters.push(
    new ethereum.EventParam("symbol", ethereum.Value.fromString(symbol))
  )
  exhibitCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "ticketPrice",
      ethereum.Value.fromUnsignedBigInt(ticketPrice)
    )
  )
  exhibitCreatedEvent.parameters.push(
    new ethereum.EventParam("escrow", ethereum.Value.fromAddress(escrow))
  )
  exhibitCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  exhibitCreatedEvent.parameters.push(
    new ethereum.EventParam("baseURI", ethereum.Value.fromString(baseURI))
  )
  exhibitCreatedEvent.parameters.push(
    new ethereum.EventParam("location", ethereum.Value.fromString(location))
  )
  exhibitCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "artifactNFTAddress",
      ethereum.Value.fromAddress(artifactNFTAddress)
    )
  )
  exhibitCreatedEvent.parameters.push(
    new ethereum.EventParam("details", ethereum.Value.fromString(details))
  )

  return exhibitCreatedEvent
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

export function createTicketMintedEvent(
  exhibit: Address,
  to: Address,
  tokenId: BigInt
): TicketMinted {
  let ticketMintedEvent = changetype<TicketMinted>(newMockEvent())

  ticketMintedEvent.parameters = new Array()

  ticketMintedEvent.parameters.push(
    new ethereum.EventParam("exhibit", ethereum.Value.fromAddress(exhibit))
  )
  ticketMintedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  ticketMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return ticketMintedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
