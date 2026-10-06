export interface ServiceAccessObservation {
  status: string;
  statusRank?: number;
  observer: string;
  elapsedMs: number;
  observedAt: string;
  detail?: string;
}

export interface ServiceAccessHour {
  status?: string | null;
  statusRank?: number | null;
  observer?: string | null;
  observers?: string[] | null;
}

export interface ServiceAccessSample {
  observedAt: string;
  elapsedMs: number;
  status: string;
  statusRank: number;
  observer: string;
}

export interface ServiceAccessSamples {
  timeoutMs: number;
  samples: ServiceAccessSample[];
}

export interface ServiceUsageWindow {
  measured: boolean;
  total?: number | null;
  failed?: number | null;
  lastUsedDay?: string | null;
  viewerLoads: number;
  days?: Array<number | null> | null;
}

export interface ServiceUsagePoint {
  index: string;
  value: number;
  failed?: number | null;
}

export interface ServiceUsageOperationTotal {
  operation: string;
  requests?: number | null;
  failed?: number | null;
}

export interface ServiceUsageApplicationTotal {
  applicationId: number;
  name: string;
  requests?: number | null;
  failed?: number | null;
  viewerLoads?: number | null;
}

export interface ServiceUsageView {
  measured: boolean;
  total?: number | null;
  failed?: number | null;
  lastUsedDay?: string | null;
  viewerLoads: number;
  series?: ServiceUsagePoint[] | null;
  operations?: ServiceUsageOperationTotal[] | null;
  applications?: ServiceUsageApplicationTotal[] | null;
  previousTotal?: number | null;
  previousFailed?: number | null;
  asOf?: string | null;
}

export type ServiceUsageRange = '30d' | '90d' | '12m';

export interface ServiceAccessTrend {
  buckets: Array<ServiceAccessHour | null>;
}

export interface AffectedFailingService {
  id: number;
  name: string;
}

export interface AffectedApplication {
  applicationId: number;
  applicationName: string;
  failingServices: AffectedFailingService[];
  requests30d: number;
  usage: 'used' | 'configured';
}

export interface ServiceAccessSummary {
  serviceId: number;
  status: string;
  statusRank: number;
  observer: string;
  elapsedMs: number;
  observedAt: string;
  detail: string;
  hours: Array<ServiceAccessHour | null>;
  usage30?: ServiceUsageWindow | null;
}
