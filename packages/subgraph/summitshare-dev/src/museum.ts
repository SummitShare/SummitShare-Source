import { BigInt, log } from '@graphprotocol/graph-ts'
import {
  ExhibitCurated as ExhibitCuratedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TicketPurchased as TicketPurchasedEvent,
  MuseumCreated as MuseumCreatedEvent
} from "../generated/Museum/Museum"
import {
  Exhibit,
  ExhibitCurated, Museum, Ticket,
} from "../generated/schema"


export function handleMuseumCreated(event: MuseumCreatedEvent): void {
  log.debug("handleMuseumCreated", [])
  let museumAddress = event.params.museumAddress
  let tokenAddress = event.params.tokenAddress
  let ownerAddress = event.params.ownerAddress
  let museum = new Museum(museumAddress.toHexString())
  museum.usdcAddress = tokenAddress
  museum.owner = ownerAddress
  museum.save()

}
export function handleExhibitCurated(event: ExhibitCuratedEvent): void {

  let museumAddress = event.params.museumAddress
  let exhibitId = event.params.exhibitId
  let exhibitAddress = event.params.exhibitAddress
  let exhibitCurated = new ExhibitCurated(
    museumAddress.toHexString().concat("-").concat(exhibitId.toString())
  )
  let exhibit = Exhibit.load(exhibitAddress.toHexString())
  if (exhibit) {
    exhibit.museumId = exhibitId
    exhibit.save()
  }
  exhibitCurated.exhibit = exhibitAddress.toHexString()
  exhibitCurated.blockNumber = event.block.number
  exhibitCurated.blockTimestamp = event.block.timestamp
  exhibitCurated.transactionHash = event.transaction.hash
  exhibitCurated.save()

}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  log.info("handleOwnershipTransferred", [event.params.newOwner.toHexString()])
}

export function handleTicketPurchased(event: TicketPurchasedEvent): void {
  // create a ticket from schema with ticketid
  let ticket = new Ticket(event.params.exhibit.toHexString().concat("-").concat(event.params.tokenId.toString()))
  ticket.exhibit = event.params.exhibit.toHexString()
  ticket.buyer = event.params.buyer
  ticket.transactionHash = event.transaction.hash
  ticket.uri = event.params.tokenId.toString()
  ticket.save()

  let exhibit =  Exhibit.load(event.params.exhibit.toHexString())
  if(exhibit){
    exhibit.totalMinted = exhibit.totalMinted.plus(BigInt.fromI32(1))
    exhibit.save()
  }
}
