import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  ExhibitOrganized,
  OwnershipTransferred
} from "../generated/EventOrganizerService/EventOrganizerService"

export function createExhibitOrganizedEvent(
  exhibitId: string,
  exhibitAddress: Address,
  escrowAddress: Address
): ExhibitOrganized {
  let exhibitOrganizedEvent = changetype<ExhibitOrganized>(newMockEvent())

  exhibitOrganizedEvent.parameters = new Array()

  exhibitOrganizedEvent.parameters.push(
    new ethereum.EventParam("exhibitId", ethereum.Value.fromString(exhibitId))
  )
  exhibitOrganizedEvent.parameters.push(
    new ethereum.EventParam(
      "exhibitAddress",
      ethereum.Value.fromAddress(exhibitAddress)
    )
  )
  exhibitOrganizedEvent.parameters.push(
    new ethereum.EventParam(
      "escrowAddress",
      ethereum.Value.fromAddress(escrowAddress)
    )
  )

  return exhibitOrganizedEvent
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
