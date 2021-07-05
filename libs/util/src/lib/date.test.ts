import { validateDate } from "./date";

describe("validateDate", () => {
  const testCases: { date: string; want: boolean }[] = [
    {
      date: "2020-01-01",
      want: true,
    },
    {
date: "2020-11-31",
want: false
    }
  ];

  testCases.forEach((tc) => {
    it(`Detects ${tc.date} as ${tc.want}`, () => {
      expect(validateDate(tc.date)).toBe(tc.want);
    });
  });
});
