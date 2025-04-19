export interface MaintenanceReport {
  details: string;
  created_at: string;
  technician_name: string;
  actual_cost?: number;
  recommendations?: string;
}
