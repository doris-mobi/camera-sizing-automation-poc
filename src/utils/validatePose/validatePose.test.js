import { MINIMUM_SCORE } from "../../constants";

import {
  validateHandsDownFrontPhoto,
  getProportion,
  validateGeneralScore,
} from ".";

import pose from "../../mocks/pose.json";

describe("The getProportion util", () => {
  it("should return a 10% value succesfully", () => {
    const result = getProportion(100, 10);

    expect(result).toBe(0.1);
  });

  it("should return a 25% value succesfully", () => {
    const result = getProportion(40, 10);

    expect(result).toBe(0.25);
  });

  it("should return a 200% value succesfully", () => {
    const result = getProportion(100, 200);

    expect(result).toBe(2);
  });
});

describe("The validateGeneralScore util", () => {
  it("should approve a valid pose", () => {
    const input = { ...pose.validPoseHandsDown };

    expect(validateGeneralScore(input)).toBe(true);
  });

  it("should reject an invalid pose", () => {
    const spyConsoleError = jest.spyOn(console, "error");
    spyConsoleError.mockImplementation(() => {});

    const input = { ...pose.validPoseHandsDown };
    input.score = 0.89;

    expect(validateGeneralScore(input)).toBe(false);
    expect(spyConsoleError).toHaveBeenCalledTimes(1);
    expect(spyConsoleError).toHaveBeenCalledWith(
      `LOW SCORE (UNDER ${MINIMUM_SCORE})`
    );
  });
});

describe("The validateHandsDownFrontPhoto util", () => {
  it("should approve a valid pose", () => {
    const input = { ...pose.validPoseHandsDown };

    const result = validateHandsDownFrontPhoto(input);

    expect(result).toStrictEqual({
      valid: true,
      score: pose.validPoseHandsDown.score,
    });
  });
});
