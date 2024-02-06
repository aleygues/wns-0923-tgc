import { describe, expect, it } from "@jest/globals";
import { computeDistanceInSeconds } from "../src/helpers";

describe("distance between dates function", () => {
  it("should return the distance in seconds", () => {
    const distance = computeDistanceInSeconds(
      new Date(2024, 1, 6, 14, 23, 0),
      new Date(2024, 1, 6, 14, 25, 0)
    );
    expect(distance).toEqual(120);
  });
  it("should return 0 if dates are the same", () => {
    const distance = computeDistanceInSeconds(new Date(), new Date());
    expect(distance).toEqual(0);
  });
  it("should always return a positive value", () => {
    const distance = computeDistanceInSeconds(
      new Date(2024, 1, 6, 14, 25, 0),
      new Date(2024, 1, 6, 14, 23, 0)
    );
    expect(distance).toEqual(120);
  });
});
