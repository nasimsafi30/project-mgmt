import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: '/api/pusher/auth',
  }
);

export const PUSHER_EVENTS = {
  TASK_CREATED: 'task-created',
  TASK_UPDATED: 'task-updated',
  TASK_DELETED: 'task-deleted',
  TASK_MOVED: 'task-moved',
  COMMENT_ADDED: 'comment-added',
  NOTIFICATION: 'notification',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  CURSOR_MOVED: 'cursor-moved',
  WHITEBOARD_UPDATED: 'whiteboard-updated',
} as const;

export const PUSHER_CHANNELS = {
  PROJECT: (id: string) => `project-${id}`,
  TASK: (id: string) => `task-${id}`,
  USER: (id: string) => `user-${id}`,
  TEAM: (id: string) => `team-${id}`,
  WHITEBOARD: (id: string) => `whiteboard-${id}`,
} as const;