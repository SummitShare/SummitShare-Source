import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  ConsecutiveTransfer as ConsecutiveTransferEvent,
  Minted as MintedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent
} from "../generated/templates/ArtifactNFT/ArtifactNFT"
import {
  Artifact, Collection
} from "../generated/schema"
import { log } from '@graphprotocol/graph-ts'
//import bigint
import { BigInt } from "@graphprotocol/graph-ts"

export function handleApproval(event: ApprovalEvent): void {
  log.info("handleApproval", [])
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  log.info("handleApprovalForAll", [])
}

export function handleConsecutiveTransfer(
  event: ConsecutiveTransferEvent
): void {
  log.info("handleConsecutiveTransfer", [])
}

export function handleMinted(event: MintedEvent): void {
  
  let quantity = event.params.quantity
  let collectionId = event.address.toHexString()
  let to = event.params.to
  let collection = Collection.load(collectionId)
  let nextTokenId = 0;
  if (collection) {
    nextTokenId = collection.totalMinted.toI32()
    for (let i = 0; i < quantity.toI32(); i++) {
      nextTokenId = nextTokenId + 1
      let artifactId = collectionId.concat("-").concat(nextTokenId.toString())
      let artifact = new Artifact(artifactId)
      artifact.collection = collectionId
      artifact.tokenURI = collection.baseURI.concat(nextTokenId.toString())
      artifact.owner = to
      artifact.save()
    }
    collection.totalMinted = collection.totalMinted.plus(event.params.quantity)
    collection.save()
  }
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  log.info("handleOwnershipTransferred", [])
}

export function handleTransfer(event: TransferEvent): void {
  // let from = event.params.from
  // let to = event.params.to
  // let tokenId = event.params.tokenId
  // let artifactId = event.address.toHexString().concat("-").concat(tokenId.toString())
  // let collectionId = event.address.toHexString()
  // //load collection 
  // let collection = Collection.load(collectionId)
  // let artifact = Artifact.load(artifactId)

  // if (collection && artifact) {
  //   artifact.owner = to
  //   artifact.save()
  // }
}
