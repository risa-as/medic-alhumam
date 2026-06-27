// Metro config لمونوريبو pnpm: مراقبة جذر المستودع وحلّ الحزم المشتركة.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// مراقبة جذر المونوريبو لالتقاط packages/* المشتركة
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// مهم لـ pnpm: نُبقي البحث الهرمي مُفعَّلًا (الافتراضي) ليجد Metro اعتماديات كل حزمة
// داخل node_modules الخاصّة بها في .pnpm (مثل whatwg-fetch/anser لـ @expo/metro-runtime).
// تعطيله (disableHierarchicalLookup=true) يكسر حلّ الاعتماديات في pnpm.
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
