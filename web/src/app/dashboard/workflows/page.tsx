'use client';

import { useState } from 'react';
import { DragDropEditor } from '@/components/drag-drop-editor';
import { api } from '@/lib/api';

const templates = [
  'Lead qualification pipeline',
  'Abandoned cart recovery',
  'Invoice overdue reminder',
  'Ticket escalation flow'
];

export default function WorkflowsPage() {
  const [name, setName] = useState('Revenue Recovery Flow');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0 }}>Workflow Studio</h2>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Projektuj i uruchamiaj automatyzacje krok po kroku</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-ghost"
            onClick={async () => {
              await api('/workflows', {
                method: 'POST',
                body: JSON.stringify({
                  name,
                  nodes: [{ id: 'n1', type: 'trigger', config: { event: 'manual' } }],
                  edges: []
                })
              });
              setMessage('Workflow zapisany jako szkic');
            }}
          >
            Zapisz szkic
          </button>
          <button className="btn btn-primary" onClick={() => setMessage('Uruchomiono testowy run workflow')}>Run now</button>
        </div>
      </div>

      <div className="panel">
        <label>
          Nazwa workflow
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div className="panel">
        <strong>Szablony</strong>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {templates.map((template) => (
            <button key={template} className="btn btn-ghost" onClick={() => setName(template)}>{template}</button>
          ))}
        </div>
      </div>

      <DragDropEditor />

      {message ? <div className="panel">{message}</div> : null}
    </div>
  );
}
