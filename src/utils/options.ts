import {
  MarkerType,
  type DefaultEdgeOptions,
  type FitViewOptions,
} from "@xyflow/react";

export const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

export const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  deletable: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    height: 20,
    width: 20,
    color: "gold",
  },
  selectable: true,
  style: {
    strokeWidth: 2,
    stroke: "gold",
    strokeDasharray: "5, 2",
  },
  type: "smoothstep",
};
