export interface Database {
  public: {
    Tables: {
      maintenance_requests: {
        Row: {
          id: string;
          store_id: string;
          title: string;
          description: string;
          status: "pending" | "in_progress" | "completed" | "cancelled";
          priority: "low" | "medium" | "high" | "urgent";
          created_at: string;
          updated_at: string;
          created_by: string;
          assigned_to: string | null;
          service_type: string | null;
          primary_service_id: string | null;
          scheduled_date: string | null;
          completion_date: string | null;
          estimated_cost: number | null;
          actual_cost: number | null;
          is_deleted: boolean;
          daftera_invoice_id: string | null;
        };
        Insert: {
          id?: string;
          store_id: string;
          title: string;
          description: string;
          status: "pending" | "in_progress" | "completed" | "cancelled";
          priority: "low" | "medium" | "high" | "urgent";
          created_at?: string;
          updated_at?: string;
          created_by: string;
          assigned_to?: string | null;
          service_type?: string | null;
          primary_service_id?: string | null;
          scheduled_date?: string | null;
          completion_date?: string | null;
          estimated_cost?: number | null;
          actual_cost?: number | null;
          is_deleted?: boolean;
          daftera_invoice_id?: string | null;
        };
        Update: {
          id?: string;
          store_id?: string;
          title?: string;
          description?: string;
          status?: "pending" | "in_progress" | "completed" | "cancelled";
          priority?: "low" | "medium" | "high" | "urgent";
          created_at?: string;
          updated_at?: string;
          created_by?: string;
          assigned_to?: string | null;
          service_type?: string | null;
          primary_service_id?: string | null;
          scheduled_date?: string | null;
          completion_date?: string | null;
          estimated_cost?: number | null;
          actual_cost?: number | null;
          is_deleted?: boolean;
          daftera_invoice_id?: string | null;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          location: string | null;
          phone: string | null;
          email: string | null;
          category: string | null;
          status: "active" | "inactive" | null;
          area: number | null;
          opening_date: string | null;
          region_id: string | null;
          created_by: string | null;
          updated_by: string | null;
          is_deleted: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          map_url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          location?: string | null;
          phone?: string | null;
          email?: string | null;
          category?: string | null;
          status?: "active" | "inactive" | null;
          area?: number | null;
          opening_date?: string | null;
          region_id?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          is_deleted?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          map_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          location?: string | null;
          phone?: string | null;
          email?: string | null;
          category?: string | null;
          status?: "active" | "inactive" | null;
          area?: number | null;
          opening_date?: string | null;
          region_id?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          is_deleted?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          map_url?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "admin" | "user" | "technician";
          department_id: string | null;
          reports_to: string | null;
          position: string | null;
          created_by: string | null;
          updated_by: string | null;
          is_deleted: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: "admin" | "user" | "technician";
          department_id?: string | null;
          reports_to?: string | null;
          position?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          is_deleted?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: "admin" | "user" | "technician";
          department_id?: string | null;
          reports_to?: string | null;
          position?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          is_deleted?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          request_id: string;
          user_id: string;
          content: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          user_id: string;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          user_id?: string;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workflow_steps: {
        Row: {
          id: string;
          request_id: string;
          step_name: string;
          status: "pending" | "in_progress" | "completed";
          started_at: string | null;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          step_name: string;
          status: "pending" | "in_progress" | "completed";
          started_at?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          step_name?: string;
          status?: "pending" | "in_progress" | "completed";
          started_at?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          request_id: string;
          total_cost: number;
          tax: number | null;
          discount: number | null;
          grand_total: number;
          issued_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          total_cost: number;
          tax?: number | null;
          discount?: number | null;
          grand_total: number;
          issued_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          total_cost?: number;
          tax?: number | null;
          discount?: number | null;
          grand_total?: number;
          issued_by?: string;
          created_at?: string;
        };
      };
      ratings: {
        Row: {
          id: string;
          request_id: string | null;
          user_id: string | null;
          stars: number | null;
          comment: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          request_id?: string | null;
          user_id?: string | null;
          stars?: number | null;
          comment?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          request_id?: string | null;
          user_id?: string | null;
          stars?: number | null;
          comment?: string | null;
          created_at?: string | null;
        };
      };
      history: {
        Row: {
          id: string;
          request_id: string | null;
          user_id: string | null;
          action: string | null;
          details: string | null;
          timestamp: string | null;
        };
        Insert: {
          id?: string;
          request_id?: string | null;
          user_id?: string | null;
          action?: string | null;
          details?: string | null;
          timestamp?: string | null;
        };
        Update: {
          id?: string;
          request_id?: string | null;
          user_id?: string | null;
          action?: string | null;
          details?: string | null;
          timestamp?: string | null;
        };
      };
      maintenance_services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string | null;
          estimated_cost: number | null;
          estimated_time: number | null;
          is_active: boolean | null;
          icon: string | null;
          created_by: string | null;
          updated_by: string | null;
          is_deleted: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category?: string | null;
          estimated_cost?: number | null;
          estimated_time?: number | null;
          is_active?: boolean | null;
          icon?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          is_deleted?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string | null;
          estimated_cost?: number | null;
          estimated_time?: number | null;
          is_active?: boolean | null;
          icon?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          is_deleted?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      maintenance_requests_archive: {
        Row: Database["public"]["Tables"]["maintenance_requests"]["Row"];
        Insert: Database["public"]["Tables"]["maintenance_requests"]["Insert"];
        Update: Database["public"]["Tables"]["maintenance_requests"]["Update"];
      };
    };
  };
}
