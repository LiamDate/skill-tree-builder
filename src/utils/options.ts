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
    height: 15,
    width: 15,
  },
  selectable: true,
};
