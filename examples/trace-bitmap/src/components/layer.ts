import type { Predicate } from "@thi.ng/api";
import {
	button,
	div,
	inputColor,
	inputNumber,
	type InputNumericAttribs,
} from "@thi.ng/hiccup-html";
import { $list } from "@thi.ng/rdom";
import { staticDropdown } from "@thi.ng/rdom-components";
import {
	THEME,
	TRACE_MODE_ORDER,
	TRACE_MODES,
	type LayerParam,
	type TraceMode,
} from "../api";
import { DB } from "../state/atom";
import {
	addLayer,
	duplicateLayer,
	moveLayer,
	removeLayer,
	setLayerMode,
	updateLayerParam,
} from "../state/layers";
import { layerOrder } from "../state/process";

const layerControlsForID = (layerID: string) => {
	const { ctrls } = DB.deref().layers[layerID];
	const moveButton = (dir: -1 | 1, tx: Predicate<string[]>) =>
		button(
			{
				class: "w-25",
				onclick: () => moveLayer(layerID, dir),
				disabled: layerOrder.map(tx),
			},
			dir > 0 ? "↓" : "↑"
		);
	const onchange =
		(param: LayerParam, isNum = false) =>
		(e: Event) =>
			updateLayerParam(
				layerID,
				param,
				isNum
					? parseInt((<HTMLInputElement>e.target).value)
					: (<HTMLInputElement>e.target).value
			);
	const param = (
		pid: Exclude<LayerParam, "mode" | "color">,
		min: number,
		max: number,
		attribs?: Partial<InputNumericAttribs>
	) =>
		inputNumber({
			onchange: onchange(pid, true),
			class: "w-25",
			step: 1,
			min,
			max,
			...attribs,
			value: ctrls[pid],
		});
	return div(
		{ class: THEME.sideBar.section },
		div(
			{ class: THEME.sideBar.control },
			button(
				{
					class: "w-25",
					onclick: () => removeLayer(layerID),
				},
				"-"
			),
			button(
				{
					class: "w-25",
					onclick: () => duplicateLayer(layerID),
				},
				"dup"
			),
			moveButton(-1, (order) => order.indexOf(layerID) === 0),
			moveButton(
				1,
				(order) => order.indexOf(layerID) === order.length - 1
			)
		),
		staticDropdown(TRACE_MODE_ORDER, ctrls.mode, {
			label: (x) => TRACE_MODES[<TraceMode>x].label,
			attribs: {
				class: THEME.sideBar.control,
				onchange: (e) =>
					setLayerMode(
						layerID,
						<TraceMode>(<HTMLSelectElement>e.target).value
					),
			},
		}),
		inputColor({
			class: THEME.sideBar.control,
			oninput: onchange("color"),
			value: ctrls.color,
		}),
		param("min", 0, 1000, {
			min: ctrls.mode.map((id) => (TRACE_MODES[id].points ? 0 : 2)),
			disabled: ctrls.mode.map((id) => TRACE_MODES[id].points),
		}),
		param("max", 0, 1000, {
			min: ctrls.mode.map((id) => (TRACE_MODES[id].points ? 0 : 1)),
			// disabled: ctrls.dir.map((id) => TRACE_MODES[id].points),
		}),
		param("slope", 1, 16, {
			disabled: ctrls.mode.map(
				(id) => !TRACE_MODES[id].slope || TRACE_MODES[id].points
			),
		}),
		param("skip", 0, 16, {
			disabled: ctrls.mode.map((id) => !TRACE_MODES[id].skip),
		})
	);
};

export const layerControls = div(
	{},
	button(
		{
			class: THEME.button.large,
			onclick: () => addLayer(),
		},
		"+ add layer"
	),
	$list(layerOrder, "div", {}, layerControlsForID)
);
