'use client';

import { useMemo, useState } from 'react';

type NodeType = 'trigger' | 'condition' | 'email' | 'webhook' | 'delay' | 'task';

type NodeItem = {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  config: Record<string, string>;
};

const palette: { type: NodeType; label: string }[] = [
  { type: 'trigger', label: 'Trigger' },
  { type: 'condition', label: 'Condition' },
  { type: 'email', label: 'Email' },
  { type: 'webhook', label: 'Webhook' },
  { type: 'delay', label: 'Delay' },
  { type: 'task', label: 'Task' }
];

export function DragDropEditor() {
  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function onDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    const type = ev.dataTransfer.getData('node-type') as NodeType;
    const rect = ev.currentTarget.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    const created: NodeItem = {
      id: crypto.randomUUID(),
      type,
      x,
      y,
      config: {
        label: `${type.toUpperCase()} step`,
        retries: '1',
        timeout: '30'
      }
    };

    setNodes((prev) => [...prev, created]);
    setSelectedId(created.id);
  }

  const selected = useMemo(() => nodes.find((n) => n.id === selectedId) ?? null, [nodes, selectedId]);

  function updateSelected(field: string, value: string) {
    if (!selected) return;
    setNodes((prev) => prev.map((node) => (node.id === selected.id ? { ...node, config: { ...node.config, [field]: value } } : node)));
  }

  return (
    <div className="workflow-layout">
      <div className="panel">
        <strong>Node Library</strong>
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          {palette.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(ev) => ev.dataTransfer.setData('node-type', item.type)}
              style={{ padding: 10, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', cursor: 'grab' }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="panel canvas" onDragOver={(ev) => ev.preventDefault()} onDrop={onDrop}>
        {nodes.map((node) => (
          <button
            key={node.id}
            className={`canvas-node ${selectedId === node.id ? 'active' : ''}`}
            style={{ left: node.x, top: node.y }}
            onClick={() => setSelectedId(node.id)}
          >
            {node.type}
          </button>
        ))}
        {nodes.length === 0 ? <p style={{ color: 'var(--muted)' }}>Przeciągnij pierwsze node na canvas.</p> : null}
      </div>

      <div className="panel">
        <strong>Inspector</strong>
        {selected ? (
          <div className="grid" style={{ marginTop: 10 }}>
            <label>
              Label
              <input
                className="input"
                value={selected.config.label ?? ''}
                onChange={(e) => updateSelected('label', e.target.value)}
              />
            </label>
            <label>
              Retries
              <input
                className="input"
                value={selected.config.retries ?? '1'}
                onChange={(e) => updateSelected('retries', e.target.value)}
              />
            </label>
            <label>
              Timeout (s)
              <input
                className="input"
                value={selected.config.timeout ?? '30'}
                onChange={(e) => updateSelected('timeout', e.target.value)}
              />
            </label>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)' }}>Wybierz node, aby konfigurować.</p>
        )}
      </div>
    </div>
  );
}
