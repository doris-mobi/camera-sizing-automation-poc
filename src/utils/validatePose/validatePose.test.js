import { validateHandsDownFrontPhoto, compareDistance } from ".";

import pose from "../../mocks/pose.json";

describe("The compareDistance util", () => {
  it("should return a 10% value succesfully", () => {
    const result = compareDistance(100, 10);

    expect(result).toBe(0.1);
  });

  it("should return a 25% value succesfully", () => {
    const result = compareDistance(40, 10);

    expect(result).toBe(0.25);
  });

  it("should return a 200% value succesfully", () => {
    const result = compareDistance(100, 200);

    expect(result).toBe(2);
  });
});

describe("The validateHandsDownFrontPhoto util", () => {
  it("should approve a valid pose", () => {
    const input = pose.validPoseHandsDown;

    const result = validateHandsDownFrontPhoto(input);

    expect(result).toStrictEqual({
      valid: true,
      score: pose.validPoseHandsDown.score,
    });
  });

  it("should reject a low score pose", () => {
    const input = pose.validPoseHandsDown;
    input.score = 0.89;

    const result = validateHandsDownFrontPhoto(input);

    expect(result).toStrictEqual({ valid: false, score: input.score });
  });
});
