import { DateFormatValueConverter } from "./dateFormat";

const dateFormat = new DateFormatValueConverter();

describe("Dateformat value converter", () => {
  const firstOfApril = "1490997600000";
  const illegalDate = "abc";

  it("should return the default format if given correct date but no format", () => {
    expect(dateFormat.toView(firstOfApril)).not.toBe("Invalid date");
  });

  it("should return the given format if given correct date and format", () => {
    expect(dateFormat.toView(firstOfApril, "YYYY")).toBe("2017");
  });

  it("should show a error message if the given value is illegal", () => {
    expect(dateFormat.toView(illegalDate)).toBe("Invalid date");
  });
});
