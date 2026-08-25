import { featureStatus, type FeatureKey } from "@/lib/feature-status";
import { featureStatusLabel, type FeatureStatus } from "@/lib/mvp-config";

const toneClass: Record<FeatureStatus, string> = {
  available: "status-available",
  "in-progress": "status-in-progress",
  planned: "status-planned",
};

/**
 * Selo de estágio de uma funcionalidade. Lê o status da fonte central —
 * nunca receba o status por prop no JSX, para não abrir espaço a divergência
 * entre seções.
 */
export function StatusPill({ feature }: { feature: FeatureKey }) {
  const status = featureStatus[feature];
  return (
    <span className={`status-pill ${toneClass[status]}`}>{featureStatusLabel[status]}</span>
  );
}
