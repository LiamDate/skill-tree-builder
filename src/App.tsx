import { useState, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";

const initialNodes: Node[] = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges: Edge[] = [{ id: "n1-n2", source: "n1", target: "n2" }];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log("drag event", node.data);
};

const App = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}
    />
  );
};

export default App;
