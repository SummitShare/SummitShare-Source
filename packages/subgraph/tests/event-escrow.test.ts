import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { PaymentDistributed } from "../generated/schema"
import { PaymentDistributed as PaymentDistributedEvent } from "../generated/EventEscrow/EventEscrow"
import { handlePaymentDistributed } from "../src/event-escrow"
import { createPaymentDistributedEvent } from "./event-escrow-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let beneficiary = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let newPaymentDistributedEvent = createPaymentDistributedEvent(
      beneficiary,
      amount
    )
    handlePaymentDistributed(newPaymentDistributedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("PaymentDistributed created and stored", () => {
    assert.entityCount("PaymentDistributed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "PaymentDistributed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "beneficiary",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "PaymentDistributed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
