import { cossin } from "@thi.ng/math/angle";
import { add2 } from "./add.js";
import { ZERO2, ZERO3, type MultiVecOpVO, type ReadonlyVec } from "./api.js";
import { setC3 } from "./setc.js";
import { vop } from "./vop.js";

const cos = Math.cos;
const sin = Math.sin;

/**
 * Converts polar vector `v` to cartesian coordinates and adds optional
 * `offset`. See {@link polar} for reverse operation. If `out` is null,
 * modifies `v` in place.
 *
 * @param out -
 * @param v -
 * @param offset -
 */
export const cartesian: MultiVecOpVO<ReadonlyVec> = vop(1);

/**
 * Converts 2D polar vector `v` to cartesian coordinates and adds
 * optional `offset`. See {@link polar} for reverse operation. If `out` is
 * null, modifies `v` in place.
 *
 * @param out -
 * @param v -
 * @param offset -
 */
export const cartesian2 = cartesian.add(2, (out, a, b = ZERO2) =>
	add2(out || a, cossin(a[1], a[0]), b)
);

/**
 * Converts 3D polar vector `v` to cartesian coordinates and adds
 * optional `offset`. See {@link polar} for reverse operation. If `out` is
 * null, modifies `v` in place.
 *
 * @param out -
 * @param v -
 * @param offset -
 */
export const cartesian3 = cartesian.add(3, (out, a, b = ZERO3) => {
	const r = a[0];
	const theta = a[1];
	const phi = a[2];
	const ct = cos(theta);
	return setC3(
		out || a,
		r * ct * cos(phi) + b[0],
		r * ct * sin(phi) + b[1],
		r * sin(theta) + b[2]
	);
});
