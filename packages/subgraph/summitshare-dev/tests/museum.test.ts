import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ExhibitCurated } from "../generated/schema"
import { ExhibitCurated as ExhibitCuratedEvent } from "../generated/Museum/Museum"
import { handleExhibitCurated } from "../src/museum"
import { createExhibitCuratedEvent } from "./museum-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let museumAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let exhibitId = "Example string value"
    let exhibitAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newExhibitCuratedEvent = createExhibitCuratedEvent(
      museumAddress,
      exhibitId,
      exhibitAddress
    )
    handleExhibitCurated(newExhibitCuratedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ExhibitCurated created and stored", () => {
    assert.entityCount("ExhibitCurated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ExhibitCurated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "museumAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ExhibitCurated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "exhibitId",
      "Example string value"
    )
    assert.fieldEquals(
      "ExhibitCurated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "exhibitAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
