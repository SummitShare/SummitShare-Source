import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { PaymentDistributed } from "../generated/EventEscrow/EventEscrow"

export function createPaymentDistributedEvent(
  beneficiary: Address,
  amount: BigInt
): PaymentDistributed {
  let paymentDistributedEvent = changetype<PaymentDistributed>(newMockEvent())

  paymentDistributedEvent.parameters = new Array()

  paymentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  )
  paymentDistributedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return paymentDistributedEvent
}
