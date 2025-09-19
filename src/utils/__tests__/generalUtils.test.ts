import { expect, describe, it } from "vitest";
import { capitaliseFirstLetter } from "../generalUtils";

describe("capitaliseFirstLetter", () => {
  it("capitalises the first letter in a multi-character string", () => {
    expect(capitaliseFirstLetter("test string")).toEqual("Test string");
  });

  it("returns the input string if the first letter is already capitalised in a multi-character string", () => {
    expect(capitaliseFirstLetter("Test string")).toEqual("Test string");
  });

  it("capitalises the first letter in a single-character string", () => {
    expect(capitaliseFirstLetter("t")).toEqual("T");
  });

  it("returns the input string if the first letter is already capitalised in a single-character string", () => {
    expect(capitaliseFirstLetter("T")).toEqual("T");
  });

  it("returns nothing if the string is empty", () => {
    expect(capitaliseFirstLetter("")).toEqual("");
  });

  it("returns the input string if the string is white space", () => {
    expect(capitaliseFirstLetter("   ")).toEqual("   ");
  });

  it("returns the input string if the first character is a number in a multi-character string", () => {
    expect(capitaliseFirstLetter("250")).toEqual("250");
  });

  it("returns the input string if the first character is a number in a single-character string", () => {
    expect(capitaliseFirstLetter("2")).toEqual("2");
  });
});
