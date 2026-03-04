import { DragDropEditor } from '@/components/drag-drop-editor';

export default function WorkflowsPage() {
  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="panel">
        <h2>Workflow Builder (Drag & Drop)</h2>
        <p style={{ color: 'var(--muted)' }}>Edytor do tworzenia automatyzacji.</p>
      </div>
      <DragDropEditor />
    </div>
  );
}
