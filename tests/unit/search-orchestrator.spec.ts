import { describe, expect, test } from "vitest";
import {
	buildSearchUrl,
	isFetchUrl,
	normalizeFetchUrl,
	truncateResults,
} from "../../src/search-orchestrator";

describe("search-orchestrator", () => {
	describe("buildSearchUrl", () => {
		test("constructs DuckDuckGo Lite URL", () => {
			const url = buildSearchUrl("zig best practices");
			expect(url).toBe("https://lite.duckduckgo.com/lite/?q=zig%20best%20practices");
		});

		test("encodes special characters", () => {
			const url = buildSearchUrl("hello & world");
			expect(url).toContain("hello%20%26%20world");
		});
	});

	describe("isFetchUrl", () => {
		test("returns true for absolute http and https URLs", () => {
			expect(isFetchUrl("https://lightpanda.io/docs")).toBe(true);
			expect(isFetchUrl("http://example.com/page")).toBe(true);
		});

		test("returns false for search terms and unsupported schemes", () => {
			expect(isFetchUrl("zig best practices")).toBe(false);
			expect(isFetchUrl("ftp://example.com/file.txt")).toBe(false);
		});
	});

	describe("normalizeFetchUrl", () => {
		test("trims whitespace around a valid URL", () => {
			expect(normalizeFetchUrl("  https://lightpanda.io/docs  ")).toBe(
				"https://lightpanda.io/docs",
			);
		});

		test("throws on invalid direct fetch URLs", () => {
			expect(() => normalizeFetchUrl("lightpanda.io/docs")).toThrow(
				"URL must be an absolute http(s) URL",
			);
		});
	});

	describe("truncateResults", () => {
		test("limits array to max results", () => {
			const results = [
				{ title: "A", url: "a.com", snippet: "..." },
				{ title: "B", url: "b.com", snippet: "..." },
				{ title: "C", url: "c.com", snippet: "..." },
			];
			const truncated = truncateResults(results, 2);
			expect(truncated).toHaveLength(2);
			expect(truncated[0].title).toBe("A");
			expect(truncated[1].title).toBe("B");
		});

		test("returns all if less than max", () => {
			const results = [{ title: "A", url: "a.com", snippet: "..." }];
			const truncated = truncateResults(results, 5);
			expect(truncated).toHaveLength(1);
		});
	});
});
