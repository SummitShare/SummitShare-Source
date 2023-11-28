import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  ArtifactNFTDeployed,
  ExhibitNFTDeployed,
  OwnershipTransferred
} from "../generated/EventOrganizerService/EventOrganizerService"

export function createArtifactNFTDeployedEvent(
  artifactNFTAddress: Address,
  name: string,
  symbol: string,
  ownerAddress: Address,
  baseURI: string
): ArtifactNFTDeployed {
  let artifactNftDeployedEvent = changetype<ArtifactNFTDeployed>(newMockEvent())

  artifactNftDeployedEvent.parameters = new Array()

  artifactNftDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "artifactNFTAddress",
      ethereum.Value.fromAddress(artifactNFTAddress)
    )
  )
  artifactNftDeployedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  artifactNftDeployedEvent.parameters.push(
    new ethereum.EventParam("symbol", ethereum.Value.fromString(symbol))
  )
  artifactNftDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "ownerAddress",
      ethereum.Value.fromAddress(ownerAddress)
    )
  )
  artifactNftDeployedEvent.parameters.push(
    new ethereum.EventParam("baseURI", ethereum.Value.fromString(baseURI))
  )

  return artifactNftDeployedEvent
}

export function createExhibitNFTDeployedEvent(
  exhibitId: string,
  exhibitNFTAddress: Address,
  escrowAddress: Address,
  museumAddress: Address
): ExhibitNFTDeployed {
  let exhibitNftDeployedEvent = changetype<ExhibitNFTDeployed>(newMockEvent())

  exhibitNftDeployedEvent.parameters = new Array()

  exhibitNftDeployedEvent.parameters.push(
    new ethereum.EventParam("exhibitId", ethereum.Value.fromString(exhibitId))
  )
  exhibitNftDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "exhibitNFTAddress",
      ethereum.Value.fromAddress(exhibitNFTAddress)
    )
  )
  exhibitNftDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "escrowAddress",
      ethereum.Value.fromAddress(escrowAddress)
    )
  )
  exhibitNftDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "museumAddress",
      ethereum.Value.fromAddress(museumAddress)
    )
  )

  return exhibitNftDeployedEvent
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
