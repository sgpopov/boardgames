import { describe, expect, it } from "vitest";
import {
  validateAppealField,
  validateConservationPointsField,
} from "./fieldValidation";

describe("appeal field validation", () => {
  it("accepts in-range integers", () => {
    expect(validateAppealField("0")).toBeUndefined();
    expect(validateAppealField("113")).toBeUndefined();
  });

  it("requires a value", () => {
    expect(validateAppealField("")).toBe("Required");
    expect(validateAppealField("   ")).toBe("Required");
  });

  it("rejects non-integers and out-of-range values", () => {
    expect(validateAppealField("1.5")).toMatch(/whole number/);
    expect(validateAppealField("abc")).toMatch(/whole number/);
    expect(validateAppealField("114")).toMatch(/between 0 and 113/);
  });
});

describe("conservation points field validation", () => {
  it("accepts in-range integers", () => {
    expect(validateConservationPointsField("0")).toBeUndefined();
    expect(validateConservationPointsField("41")).toBeUndefined();
  });

  it("rejects out-of-range values", () => {
    expect(validateConservationPointsField("42")).toMatch(/between 0 and 41/);
  });
});
