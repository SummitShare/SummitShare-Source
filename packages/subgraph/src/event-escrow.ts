import {
  EventEscrowDeployed as EventEscrowDeployedEvent,
  PaymentDistributed as PaymentDistributedEvent
} from "../generated/templates/EventEscrow/EventEscrow"
import { Beneficiary, Escrow, PaymentDistributed } from "../generated/schema"
import { log } from '@graphprotocol/graph-ts'

export function handleEventEscrowDeployed(
  event: EventEscrowDeployedEvent
): void {

  let usdcToken = event.params.usdcToken
  let beneficiaries = event.params.beneficiaries
  let shares = event.params.shares
  let numBeneficiaries = event.params.numBeneficiaries
  let newBeneficiaries: string[] = []

  //load and update the escrow fields
  let escrow = new Escrow(event.address.toHexString())

  for (let i = 0; i < numBeneficiaries.toI32(); i++) {
    let beneficiaryId = beneficiaries[i].toHexString()
    let beneficiary = Beneficiary.load(beneficiaryId)
    if (!beneficiary) {
      beneficiary = new Beneficiary(beneficiaryId)
    }
    newBeneficiaries.push(beneficiary.id)
    beneficiary.save()
  }
  escrow.usdcToken = usdcToken
  escrow.shares = shares
  escrow.beneficiaries = newBeneficiaries
  escrow.save()
}

export function handlePaymentDistributed(event: PaymentDistributedEvent): void {

  // let beneficiary = event.params.beneficiary
  // let amount = event.params.amount
  //let indexedcaller = event.params.indexedcaller
  // let paymentDistributed = new PaymentDistributed(event.address.toHexString().concat("-").concat(beneficiary.toHexString()))

  // paymentDistributed.escrow = event.address.toHexString()
  // paymentDistributed.beneficiary = beneficiary.toHexString()
  // paymentDistributed.amount = amount
  //paymentDistributed.indexedcaller = indexedcaller.toHexString() 
  // paymentDistributed.blockNumber = event.block.number
  // paymentDistributed.blockTimestamp = event.block.timestamp
  // paymentDistributed.transactionHash = event.transaction.hash
  // paymentDistributed.save()

}
