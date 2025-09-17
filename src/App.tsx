import { useState, useCallback, type FC, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  Background,
  Controls,
  BackgroundVariant,
  ConnectionMode,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import { nodeTypes } from "./utils/flowTypes";
import CreateNodeForm from "./components/CreateNodeForm/CreateNodeForm";
import { loadFromStorage, saveToStorage } from "./utils/storageUtil";
import { defaultEdgeOptions, fitViewOptions } from "./utils/options";
import SkillInformation from "./components/SkillInformation/SkillInformation";

const App: FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [selectedNode, setSelectedNode] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(false);

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

  const createNode = (node: Node) => {
    const updatedNodes = nodes.concat([node]);
    setNodes(updatedNodes);
    saveToStorage(updatedNodes, edges);
  };

  useEffect(() => {
    const { nodes: storedNodes, edges: storedEdges } = loadFromStorage();
    setNodes(storedNodes);
    setEdges(storedEdges);
  }, []);

  const onNodeClick: NodeMouseHandler<Node> = (_event, node) => {
    setSelectedNode(node.id);
    setShowInfo(true);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionMode={ConnectionMode.Loose}
      onNodeDragStop={() => saveToStorage(nodes, edges)}
      onEdgeMouseLeave={() => saveToStorage(nodes, edges)}
      onNodeClick={onNodeClick}
    >
      <Background
        variant={BackgroundVariant.Cross}
        gap={100}
        lineWidth={2}
        color="#090b6eff"
        bgColor="#55555cff"
      />
      <CreateNodeForm createNode={createNode} />
      <SkillInformation
        id={selectedNode}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
      />
      <Controls />
    </ReactFlow>
  );
};

export default App;
