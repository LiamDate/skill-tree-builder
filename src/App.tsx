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
import CreateNodeForm from "./components/CreateNodeForm";
import SkillInformationPanel from "./components/SkillInformationPanel";
import InvalidToast from "./components/InvalidToast";
import {
  getEdgesFromStorage,
  getNodesFromStorage,
  saveEdgesToStorage,
  saveNodesToStorage,
} from "./utils/storageUtil";
import { defaultEdgeOptions, fitViewOptions } from "./utils/options";

const initialNodes = getNodesFromStorage();
const initialEdges = getEdgesFromStorage();

/**
 * App component containing the ReactFlow and all application functionality.
 * @returns {FC} The application.
 */
const App: FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const [selectedNode, setSelectedNode] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(false);

  /**
   * Updates node state when nodes change.
   */
  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  /**
   * Updates edge state when edges change.
   */
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  /**
   * Adds new edge on connection.
   */
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  /**
   * Creates new node element from node data.
   * @param {Node} node - The node to be created.
   */
  const createNode = (node: Node) => {
    const updatedNodes = nodes.concat([node]);
    setNodes(updatedNodes);
  };

  /**
   * Saves node and edge data to store on changes
   */
  useEffect(() => {
    saveNodesToStorage(nodes);
    saveEdgesToStorage(edges);
  }, [nodes, edges]);

  /**
   * Opens the information panel when a node is clicked
   * @param {React.MouseEvent<Element, MouseEvent>} _event - The click event.
   * @param {Node} node - The selected node.
   */
  const onNodeClick: NodeMouseHandler<Node> = (_event, node) => {
    setSelectedNode(node.id);
    setShowInfo(true);
  };

  return (
    <div className="app">
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
        <SkillInformationPanel
          id={selectedNode}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
        />
        <InvalidToast />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default App;
