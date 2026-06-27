import { app } from "electron";
import * as fs from "fs";
import * as path from "path";

interface LocalConfig {
  serverUrl?: string;
  syncSecret?: string;
}

function configPath() {
  return path.join(app.getPath("userData"), "medic-config.json");
}

export function readLocalConfig(): LocalConfig {
  try {
    return JSON.parse(fs.readFileSync(configPath(), "utf8")) as LocalConfig;
  } catch {
    return {};
  }
}

export function writeLocalConfig(cfg: LocalConfig): void {
  fs.writeFileSync(configPath(), JSON.stringify(cfg, null, 2), "utf8");
}
