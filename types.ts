export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum IssueType {
  TASK = 'Task',
  BUG = 'Bug',
  STORY = 'Story',
  EPIC = 'Epic'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'Admin' | 'Manager' | 'Developer' | 'Viewer';
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
}

export interface Issue {
  id: string;
  projectId: string; // Link issue to specific project
  key: string; // e.g., HK-101
  title: string;
  description: string;
  status: string; // Maps to Column ID
  priority: Priority;
  type: IssueType;
  assigneeId?: string;
  reporterId: string;
  dueDate?: Date;
  points?: number;
  comments: Comment[];
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  key: string; // e.g., TSTR
  description: string;
  managerId: string; // The Project Manager
  memberIds: string[]; // List of users authorized to see this project
  createdAt: Date;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
}

export type ViewMode = 'DASHBOARD' | 'BOARD' | 'BACKLOG' | 'ROADMAP' | 'SETTINGS' | 'REPORTS';