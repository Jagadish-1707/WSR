export interface Priority {
    // Id: number;
    // Customer: string;
    // Project: string;
    // ProjectPriority : string;
    // Status : number;
    // Remarks: string;
    id?: number;
    customerId?: string,
    projectId?:string,
    customer: string;
    project: string;
    projectPriority: string;
    remarks?: string | null;
    active?: boolean;
    status: number;
    }