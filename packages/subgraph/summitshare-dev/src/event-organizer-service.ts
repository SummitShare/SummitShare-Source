import {
  ArtifactNFTDeployed as ArtifactNFTDeployedEvent,
  ExhibitNFTDeployed as ExhibitNFTDeployedEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/EventOrganizerService/EventOrganizerService"
import {
  ArtifactNFTDeployed,
  ExhibitNFTDeployed,
  OwnershipTransferred
} from "../generated/schema"

export function handleArtifactNFTDeployed(
  event: ArtifactNFTDeployedEvent
): void {
  let entity = new ArtifactNFTDeployed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.artifactNFTAddress = event.params.artifactNFTAddress
  entity.name = event.params.name
  entity.symbol = event.params.symbol
  entity.ownerAddress = event.params.ownerAddress
  entity.baseURI = event.params.baseURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExhibitNFTDeployed(event: ExhibitNFTDeployedEvent): void {
  let entity = new ExhibitNFTDeployed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.exhibitId = event.params.exhibitId
  entity.exhibitNFTAddress = event.params.exhibitNFTAddress
  entity.escrowAddress = event.params.escrowAddress
  entity.museumAddress = event.params.museumAddress

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
