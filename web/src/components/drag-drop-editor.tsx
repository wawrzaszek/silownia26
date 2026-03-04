'use client';

import { useState } from 'react';

type NodeItem = { id: string; type: string; x: number; y: number };

const palette = [
  { type: 'trigger', label: 'Trigger' },
  { type: 'email', label: 'Email' },
  { type: 'webhook', label: 'Webhook' },
  { type: 'delay', label: 'Delay' }
];

export function DragDropEditor() {
  const [nodes, setNodes] = useState<NodeItem[]>([]);

  function onDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    const type = ev.dataTransfer.getData('node-type');
    const rect = ev.currentTarget.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    setNodes((prev) => [...prev, { id: crypto.randomUUID(), type, x, y }]);
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '200px 1fr' }}>
      <div className="panel">
        <strong>Komponenty</strong>
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          {palette.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(ev) => ev.dataTransfer.setData('node-type', item.type)}
              style={{ padding: 10, borderRadius: 10, background: 'var(--surface-alt)', cursor: 'grab' }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <div
        className="panel"
        onDragOver={(ev) => ev.preventDefault()}
        onDrop={onDrop}
        style={{ minHeight: 380, position: 'relative', overflow: 'hidden' }}
      >
        {nodes.map((node) => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              transform: 'translate(-50%, -50%)',
              background: 'var(--brand)',
              color: 'white',
              padding: '8px 10px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700
            }}
          >
            {node.type}
          </div>
        ))}
        {nodes.length === 0 ? <p style={{ color: 'var(--muted)' }}>Przeciągnij elementy tutaj.</p> : null}
      </div>
    </div>
  );
}
