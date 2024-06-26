import { BigInt } from "@graphprotocol/graph-ts"
import {
  EventOrganizerService,
  ArtifactNFTDeployed,
  ExhibitNFTDeployed,
  OwnershipTransferred
} from "../generated/EventOrganizerService/EventOrganizerService"
import { log } from '@graphprotocol/graph-ts'
import { Artifact, Collection, Escrow, Exhibit } from "../generated/schema"

import { ArtifactNFT, EventEscrow, ExhibitNFT } from '../generated/templates'

export function handleArtifactNFTDeployed(event: ArtifactNFTDeployed): void {
  let collectionId = event.params.artifactNFTAddress
  let collection = new Collection(collectionId.toHexString())
  collection.name = event.params.name
  collection.symbol = event.params.symbol
  collection.baseURI = event.params.baseURI
  collection.totalMinted = BigInt.fromI32(0)
  collection.save()

  ArtifactNFT.create(event.params.artifactNFTAddress)
}

export function handleExhibitNFTDeployed(event: ExhibitNFTDeployed): void {
  
  let exhibitId = event.params.exhibitId
  let exhibitNFTAddress = event.params.exhibitNFTAddress
  let escrowAddress = event.params.escrowAddress
  let museumAddress = event.params.museumAddress

  //create the objects in the data base
  let exhibit = new Exhibit(exhibitNFTAddress.toHexString())
  exhibit.eventId = exhibitId
  exhibit.escrow = escrowAddress.toHexString()
  exhibit.museum = museumAddress.toHexString()
  exhibit.totalMinted = BigInt.fromI32(0)
  exhibit.save()
  
  let escrow = new Escrow(escrowAddress.toHexString())
  escrow.exhibit = exhibitNFTAddress.toHexString()
  escrow.save()
  
  EventEscrow.create(event.params.escrowAddress)
  ExhibitNFT.create(event.params.exhibitNFTAddress)
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  log.debug('Block number: {}, block hash: {}, transaction hash: {}', [
    event.block.number.toString(), // "47596000"
    event.block.hash.toHexString(), // "0x..."
    event.transaction.hash.toHexString(), // "0x..."
  ])
}
