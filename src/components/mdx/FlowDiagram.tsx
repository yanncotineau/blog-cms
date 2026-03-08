"use client";

import { memo } from "react";
import {
  ReactFlow,
  Background,
  Node,
  Edge,
  MarkerType,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface FlowDiagramProps {
  nodes: Array<{
    id: string;
    label: string;
    x: number;
    y: number;
    type?: "input" | "output" | "default" | "process" | "database" | "decision";
    style?: React.CSSProperties;
  }>;
  edges: Array<{
    source: string;
    target: string;
    label?: string;
    animated?: boolean;
    style?: React.CSSProperties;
    sourceHandle?: "top" | "right" | "bottom" | "left";
    targetHandle?: "top" | "right" | "bottom" | "left";
  }>;
  height?: number;
  title?: string;
}

const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  input: { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
  output: { bg: "#14532d", border: "#22c55e", text: "#86efac" },
  process: { bg: "#3f1f5c", border: "#a855f7", text: "#d8b4fe" },
  database: { bg: "#4a2c1a", border: "#f97316", text: "#fdba74" },
  decision: { bg: "#4a1d2a", border: "#ec4899", text: "#f9a8d4" },
  default: { bg: "#1f2937", border: "#6b7280", text: "#d1d5db" },
};

const handleStyle = { opacity: 0, width: 1, height: 1 };

const MultiHandleNode = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} id="left" style={handleStyle} />
    <Handle type="target" position={Position.Top} id="top" style={handleStyle} />
    <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
    <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
    {/* Also allow source from left and target from right/bottom for loop edges */}
    <Handle type="source" position={Position.Left} id="left-source" style={handleStyle} />
    <Handle type="target" position={Position.Bottom} id="bottom-target" style={handleStyle} />
    <Handle type="target" position={Position.Right} id="right-target" style={handleStyle} />
    <Handle type="source" position={Position.Top} id="top-source" style={handleStyle} />
    {data.label}
  </>
));

MultiHandleNode.displayName = "MultiHandleNode";

const nodeTypes = { multiHandle: MultiHandleNode };

const handlePositionMap: Record<string, { source: string; target: string }> = {
  top: { source: "top-source", target: "top" },
  right: { source: "right", target: "right-target" },
  bottom: { source: "bottom", target: "bottom-target" },
  left: { source: "left-source", target: "left" },
};

export default function FlowDiagram({
  nodes: inputNodes,
  edges: inputEdges,
  height = 400,
  title,
}: FlowDiagramProps) {
  const nodes: Node[] = inputNodes.map((node) => {
    const colors = nodeColors[node.type || "default"];
    return {
      id: node.id,
      position: { x: node.x, y: node.y },
      data: { label: node.label },
      type: "multiHandle",
      style: {
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: "8px",
        padding: "12px 16px",
        color: colors.text,
        fontWeight: 500,
        fontSize: "14px",
        minWidth: "120px",
        textAlign: "center" as const,
        ...node.style,
      },
    };
  });

  const edges: Edge[] = inputEdges.map((edge, i) => ({
    id: `e${i}`,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle
      ? handlePositionMap[edge.sourceHandle].source
      : "right",
    targetHandle: edge.targetHandle
      ? handlePositionMap[edge.targetHandle].target
      : "left",
    label: edge.label,
    animated: edge.animated ?? false,
    style: {
      stroke: "#6b7280",
      strokeWidth: 2,
      ...edge.style,
    },
    labelStyle: {
      fill: "#9ca3af",
      fontWeight: 500,
      fontSize: 12,
    },
    labelBgStyle: {
      fill: "#1f2937",
      fillOpacity: 0.9,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#6b7280",
    },
  }));

  // Compute min-width from node positions so the chart doesn't squish on narrow screens
  const maxX = Math.max(...inputNodes.map((n) => n.x)) + 180; // rightmost node + ~node width
  const minWidth = Math.max(maxX, 600);

  return (
    <div className="my-6 brutal-hover">
      {title && (
        <div className="border-b border-white/15 bg-slate-900/50 px-4 py-2">
          <p className="text-sm font-medium text-slate-300 !m-0 !p-0 leading-snug">{title}</p>
        </div>
      )}
      <div className="overflow-x-auto bg-slate-950">
        <div style={{ height, minWidth }} className="bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          preventScrolling={false}
        >
          <Background color="#374151" gap={20} size={1} />
        </ReactFlow>
        </div>
      </div>
    </div>
  );
}
