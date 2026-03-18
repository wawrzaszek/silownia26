// ============================================================
// SERWER ENTRY POINT — punkt startowy aplikacji backendowej
// ============================================================
// Ten plik odpowiada za uruchomienie serwera HTTP i nasłuchiwanie
// na określonym porcie. Uruchamia również procesy w tle (scheduler).
// ============================================================

import { app } from './app.js';
import { env } from './config/env.js';
import { startScheduler } from './modules/scheduler/scheduler.service.js';

// Uruchomienie nasłuchiwania serwera na porcie zdefiniowanym w zmiennych środowiskowych (env)
app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});

// Uruchomienie schedulera — procesy cykliczne/zadania w tle
startScheduler();
