/**
 * Search orchestrator - builds URLs and coordinates search flow
 */

export interface SearchResultItem {
	title: string;
	url: string;
	snippet: string;
}

/**
 * Build DuckDuckGo Lite search URL
 */
export function buildSearchUrl(query: string): string {
	const encoded = encodeURIComponent(query);
	return `https://lite.duckduckgo.com/lite/?q=${encoded}`;
}

/**
 * Returns true when the input is an absolute http(s) URL.
 */
export function isFetchUrl(input: string): boolean {
	try {
		const parsed = new URL(input.trim());
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}

/**
 * Normalize and validate a direct fetch URL.
 */
export function normalizeFetchUrl(input: string): string {
	const normalized = input.trim();
	if (!isFetchUrl(normalized)) {
		throw new Error("URL must be an absolute http(s) URL");
	}

	return normalized;
}

/**
 * Truncate results to max count
 */
export function truncateResults<T>(results: T[], max: number): T[] {
	return results.slice(0, max);
}
