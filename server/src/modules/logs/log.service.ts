import { db } from '../../db/pool.js';

export async function logOperation(params: {
  workspaceId: string;
  userId: string;
  type: string;
  status?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await db.query(
    `INSERT INTO operation_logs(workspace_id, user_id, operation_type, status, metadata)
     VALUES ($1,$2,$3,$4,$5)`,
    [params.workspaceId, params.userId, params.type, params.status ?? 'success', params.metadata ?? {}]
  );
}
