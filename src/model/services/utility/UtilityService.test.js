import {Utility, InputPatterns} from "./UtilityService";

describe("Common utility methods.", () => {
    test("Format date.", () => {






        // expect(Utility.decorateUsername(username)).toBe("@".concat(username));
    });
    test("Decorate username.", () => {
        const username = "test";
        expect(Utility.decorateUsername(username)).toBe("@".concat(username));
    });
    test("Join multiple class names.", () => {
        const p1 = "class1", p2 = "class2";
        expect(Utility.join(p1, p2)).toBe("class1 class2");
    });
    test("Generate unique ID.", () => {
        expect(Utility.generateUniqueId()).toBeTruthy();
    });
    test("Checking whether object is empty.", () => {
        expect(Utility.isObjectEmpty(null)).toBeTruthy();
        expect(Utility.isObjectEmpty(undefined)).toBeTruthy();
        expect(Utility.isObjectEmpty("")).toBeTruthy();
        expect(Utility.isObjectEmpty({})).toBeTruthy();
        expect(Utility.isObjectEmpty("hello")).toBeFalsy();
        expect(Utility.isObjectEmpty({num: 10})).toBeFalsy();
    });
    test("Retrieving parameters from URL.", () => {
        [
            {
                paramName: "token", paramValue: "GlzjBv4Z4Bpr0NZAET044gS",
                rawUrl: `http://localhost/rest#${"token"}=${"GlzjBv4Z4Bpr0NZAET044gS"}&expires_in=3600`
            },
            {
                paramName: "code", paramValue: "456032",
                rawUrl: `http://localhost/code?demo=true&${"code"}=${"456032"}&expires_in=3600`
            }
        ].forEach(({paramName, paramValue, rawUrl}) => {
            expect(Utility.getParamFromUrl({paramName, rawUrl})).toBe(paramValue);
        });
    });
});

describe("Testing input patterns.", () => {
    test("NAME", () => {
        const pattern = InputPatterns.NAME;
        ["Test", "Super Mario", "John Doe"].forEach(value => {
            expect(Utility.matches(value, pattern)).toBeTruthy();
        });
        ["T", "6Max6", " A"].forEach(value => {
            expect(Utility.matches(value, pattern)).toBeFalsy();
        });
    });
    test("LOGIN", () => {
        const pattern = InputPatterns.LOGIN;
        ["special4you", "Test", "9gag"].forEach(value => {
            expect(Utility.matches(value, pattern)).toBeTruthy();
        });
        ["max", "hey@", " A"].forEach(value => {
            expect(Utility.matches(value, pattern)).toBeFalsy();
        });
    });
    test("PASSWORD", () => {
        const pattern = InputPatterns.PASSWORD;
        ["superpassword", "p0werp01nt", "sec◘ur☻"].forEach(value => {
            expect(Utility.matches(value, pattern)).toBeTruthy();
        });
        ["max", " ", " ♥☻"].forEach(value => {
            expect(Utility.matches(value, pattern)).toBeFalsy();
        });
    });
    test("MESSAGE_BODY", () => {
        const pattern = InputPatterns.MESSAGE_BODY;
        ["Hey, my name is Test.", "Here is my phone number: 0000000", "Привіт☺"].forEach(value => {
            expect(Utility.matches(value, pattern)).toBeTruthy();
        });
        ["", "诶艾弗"].forEach(value => {
            expect(Utility.matches(value, pattern)).toBeFalsy();
        });
    });
});