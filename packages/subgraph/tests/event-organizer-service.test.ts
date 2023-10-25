import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { ExhibitOrganized } from "../generated/schema"
import { ExhibitOrganized as ExhibitOrganizedEvent } from "../generated/EventOrganizerService/EventOrganizerService"
import { handleExhibitOrganized } from "../src/event-organizer-service"
import { createExhibitOrganizedEvent } from "./event-organizer-service-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let exhibitId = "Example string value"
    let exhibitAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let escrowAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newExhibitOrganizedEvent = createExhibitOrganizedEvent(
      exhibitId,
      exhibitAddress,
      escrowAddress
    )
    handleExhibitOrganized(newExhibitOrganizedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ExhibitOrganized created and stored", () => {
    assert.entityCount("ExhibitOrganized", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ExhibitOrganized",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "exhibitId",
      "Example string value"
    )
    assert.fieldEquals(
      "ExhibitOrganized",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "exhibitAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ExhibitOrganized",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "escrowAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
