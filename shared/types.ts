// Core Types for TaskFlow - Task Management System
// These interfaces define the data structures for our database schema

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TEAM_LEAD = 'TEAM_LEAD',
  DEVELOPER = 'DEVELOPER',
  VIEWER = 'VIEWER'
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  settings: WorkspaceSettings;
  ownerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface WorkspaceSettings {
  allowPublicProjects: boolean;
  requireApprovalForTasks: boolean;
  defaultTaskPriority: TaskPriority;
  timezone: string;
  workingDays: number[];
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  permissions: Permission[];
  joinedAt: Date;
  invitedBy?: string;
  isActive: boolean;
}

export enum WorkspaceRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST'
}

export enum Permission {
  CREATE_PROJECT = 'CREATE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  CREATE_TASK = 'CREATE_TASK',
  ASSIGN_TASK = 'ASSIGN_TASK',
  DELETE_TASK = 'DELETE_TASK',
  MANAGE_WORKSPACE = 'MANAGE_WORKSPACE'
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  workspaceId: string;
  ownerId: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  progress: number;
  isPublic: boolean;
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface ProjectSettings {
  autoAssignTasks: boolean;
  allowGuestComments: boolean;
  requireTaskApproval: boolean;
  enableTimeTracking: boolean;
  defaultTaskType: TaskType;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
  hourlyRate?: number;
  isActive: boolean;
}

export enum ProjectRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  DEVELOPER = 'DEVELOPER',
  REVIEWER = 'REVIEWER',
  VIEWER = 'VIEWER'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  creatorId: string;
  assigneeId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  labels: string[];
  estimatedHours?: number;
  actualHours?: number;
  storyPoints?: number;
  dueDate?: Date;
  startDate?: Date;
  completedAt?: Date;
  parentTaskId?: string;
  order: number;
  metadata: TaskMetadata;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  TESTING = 'TESTING',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED'
}

export enum TaskPriority {
  LOWEST = 'LOWEST',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  HIGHEST = 'HIGHEST'
}

export enum TaskType {
  FEATURE = 'FEATURE',
  BUG = 'BUG',
  ENHANCEMENT = 'ENHANCEMENT',
  RESEARCH = 'RESEARCH',
  DOCUMENTATION = 'DOCUMENTATION',
  MAINTENANCE = 'MAINTENANCE'
}

export interface TaskMetadata {
  blockedReason?: string;
  approvedBy?: string;
  reviewers: string[];
  externalLinks: string[];
  customFields: Record<string, any>;
}

export interface TaskStatusHistory {
  id: string;
  taskId: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  changedBy: string;
  reason?: string;
  createdAt: Date;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userId: string;
  assignedBy: string;
  assignedAt: Date;
  unassignedAt?: Date;
  isActive: boolean;
}

export interface Comment {
  id: string;
  content: string;
  taskId?: string;
  projectId?: string;
  authorId: string;
  parentCommentId?: string;
  mentions: string[];
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  taskId?: string;
  commentId?: string;
  projectId?: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface TimeLog {
  id: string;
  taskId: string;
  userId: string;
  description?: string;
  hours: number;
  date: Date;
  billable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  entityType: EntityType;
  entityId: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export enum NotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_OVERDUE = 'TASK_OVERDUE',
  COMMENT_ADDED = 'COMMENT_ADDED',
  MENTION = 'MENTION',
  PROJECT_INVITATION = 'PROJECT_INVITATION',
  WORKSPACE_INVITATION = 'WORKSPACE_INVITATION'
}

export enum EntityType {
  TASK = 'TASK',
  PROJECT = 'PROJECT',
  WORKSPACE = 'WORKSPACE',
  COMMENT = 'COMMENT',
  USER = 'USER'
}

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  entityType: EntityType;
  entityId: string;
  userId: string;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  ASSIGN = 'ASSIGN',
  COMPLETE = 'COMPLETE',
  COMMENT = 'COMMENT'
}

// Request/Response Types for API
export interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  priority: TaskPriority;
  type: TaskType;
  labels?: string[];
  estimatedHours?: number;
  dueDate?: Date;
  parentTaskId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assigneeId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  labels?: string[];
  estimatedHours?: number;
  dueDate?: Date;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  type?: TaskType[];
  assigneeId?: string[];
  labels?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  createdBy?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// UI Component Types for Frontend
export interface TaskColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface DragDropResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
  reason: 'DROP' | 'CANCEL';
}

export interface TaskCardProps {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isDragging?: boolean;
}

export interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskCreate?: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}