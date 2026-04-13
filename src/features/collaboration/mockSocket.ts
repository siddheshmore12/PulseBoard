import type { CollabEventType, CollabEventPayloads } from './types';

type EventCallback<T extends CollabEventType> = (payload: CollabEventPayloads[T]) => void;

class MockSocket {
  private listeners: { [K in CollabEventType]?: EventCallback<K>[] } = {};

  on<T extends CollabEventType>(event: T, callback: EventCallback<T>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  off<T extends CollabEventType>(event: T, callback: EventCallback<T>) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter((cb) => cb !== callback) as any;
  }

  emit<T extends CollabEventType>(event: T, payload: CollabEventPayloads[T]) {
    if (this.listeners[event]) {
      this.listeners[event]!.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in mock socket listener for ${event}:`, err);
        }
      });
    }
  }
}

export const socket = new MockSocket();
