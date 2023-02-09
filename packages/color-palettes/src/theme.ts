import { lch } from "@thi.ng/color/lch/lch";
import { srgb } from "@thi.ng/color/srgb/srgb";
import { assert } from "@thi.ng/errors/assert";
import { U24 } from "@thi.ng/hex";
import type {
	CSSTheme,
	LCHTheme,
	RGBTheme,
	Theme,
	ThemePredicate,
} from "./api.js";
import { BINARY, NUM_THEMES } from "./binary.js";
import { compFilter } from "./filter.js";

/**
 * Returns theme for given ID as thi.ng/color sRGB color vectors.
 *
 * @param id
 */
export const asRGB = (id: number) => {
	__ensureID(id);
	const theme: RGBTheme = <any>[];
	// (<any>theme).__id = id;
	id *= 18;
	for (let i = 0; i < 6; i++, id += 3) {
		theme.push(
			srgb(
				BINARY[id] / 255,
				BINARY[id + 1] / 255,
				BINARY[id + 2] / 255,
				1
			)
		);
	}
	return theme;
};

/**
 * Returns theme for given ID as thi.ng/color LCH color vectors.
 *
 * @param id
 */
export const asLCH = (id: number): LCHTheme => asRGB(id).map((x) => lch(x));

/**
 * Returns theme for given ID as CSS hex colors.
 *
 * @param id
 */
export const asCSS = (id: number) => {
	__ensureID(id);
	const theme: CSSTheme = [];
	// (<any>theme).__id = id;
	id *= 18;
	for (let i = 0; i < 6; i++, id += 3) {
		theme.push(
			"#" +
				U24((BINARY[id] << 16) | (BINARY[id + 1] << 8) | BINARY[id + 2])
		);
	}
	return theme;
};

/**
 * Yields iterator of RGB themes (via {@link asRGB}). Unless specific theme IDs
 * are provided, yields all themes.
 *
 * @param preds
 */
export const rgbThemes = (...preds: ThemePredicate[] | number[]) =>
	__themes(asRGB, preds);

/**
 * Yields iterator of LCH themes (via {@link asLCH}). Unless specific theme IDs
 * are provided, yields all themes.
 *
 * @param preds
 */
export const lchThemes = (...preds: ThemePredicate[] | number[]) =>
	__themes(asLCH, preds);

/**
 * Yields iterator of CSS themes (via {@link asCSS}). Unless specific theme IDs
 * are provided, yields all themes.
 *
 * @param preds
 */
export const cssThemes = (...preds: ThemePredicate[] | number[]) =>
	__themes(asCSS, preds);

function* __themes<T extends Theme>(
	fn: (id: number) => T,
	preds: ThemePredicate[] | number[]
) {
	if (preds.length && typeof preds[0] === "function") {
		const pred = compFilter(...(<ThemePredicate[]>preds));
		for (let i = 0; i < NUM_THEMES; i++) {
			const theme = fn(i);
			if (pred(theme)) yield theme;
		}
	} else if (preds.length) {
		for (let id of <number[]>preds) yield fn(id);
	} else {
		for (let i = 0; i < NUM_THEMES; i++) yield fn(i);
	}
}

const __ensureID = (id: number) =>
	assert(id >= 0 && id < NUM_THEMES, `invalid theme ID`);
