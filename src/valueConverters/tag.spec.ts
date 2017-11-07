import { TagValueConverter } from "./tag";

const tagValueConverter = new TagValueConverter();

describe("Tag valueconverter", () => {
  it("should correctly render a tag to view", () => {
    const tag: Tag = {
      key: "testKey",
      value: "testValue",
    };

    expect(tagValueConverter.toView(tag)).toBe("testKey:testValue");
  });

  it("should correctly render a tag from view", () => {
    const tagAsText = "testKey:testValue";

    expect(tagValueConverter.fromView(tagAsText)).toEqual({
      key: "testKey",
      value: "testValue",
    });
  });

  it("should correctly render a tag to and from a view with the same result", () => {
    const tag: Tag = {
      key: "testKey",
      value: "testValue",
    };

    expect(tagValueConverter.fromView(tagValueConverter.toView(tag))).toEqual(tag);
  });
});
