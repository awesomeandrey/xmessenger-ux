import {Utility} from "./UtilityService";

test("Decorate username", () => {
    const username = "test";
    expect(Utility.decorateUsername(username)).toBe("@".concat(username));
});