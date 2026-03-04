import { app } from './app.js';
import { env } from './config/env.js';
import { startScheduler } from './modules/scheduler/scheduler.service.js';

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});

startScheduler();
