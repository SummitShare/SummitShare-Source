import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import { FundsDistributed } from "../generated/Contract/Contract"

export function createFundsDistributedEvent(
  rs2Share: BigInt,
  rs3Share: BigInt
): FundsDistributed {
  let fundsDistributedEvent = changetype<FundsDistributed>(newMockEvent())

  fundsDistributedEvent.parameters = new Array()

  fundsDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "rs2Share",
      ethereum.Value.fromUnsignedBigInt(rs2Share)
    )
  )
  fundsDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "rs3Share",
      ethereum.Value.fromUnsignedBigInt(rs3Share)
    )
  )

  return fundsDistributedEvent
}
