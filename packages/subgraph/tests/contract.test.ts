import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as"
import { BigInt } from "@graphprotocol/graph-ts"
import { FundsDistributed } from "../generated/schema"
import { FundsDistributed as FundsDistributedEvent } from "../generated/Contract/Contract"
import { handleFundsDistributed } from "../src/contract"
import { createFundsDistributedEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let rs2Share = BigInt.fromI32(234)
    let rs3Share = BigInt.fromI32(234)
    let newFundsDistributedEvent = createFundsDistributedEvent(
      rs2Share,
      rs3Share
    )
    handleFundsDistributed(newFundsDistributedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FundsDistributed created and stored", () => {
    assert.entityCount("FundsDistributed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FundsDistributed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rs2Share",
      "234"
    )
    assert.fieldEquals(
      "FundsDistributed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rs3Share",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
