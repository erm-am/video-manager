import { create } from 'zustand';

enum Status {
  open = 'open',
  closed = 'closed',
  error = 'error',
}

type WebSockeState = {
  status: Status;
};

type WebSockeStateActions = {
  open: () => void;
  closed: () => void;
  error: () => void;
};

export const webSocketStore = create<WebSockeState & WebSockeStateActions>((set) => ({
  status: Status.closed,
  open: () => set({ status: Status.open }),
  closed: () => set({ status: Status.closed }),
  error: () => set({ status: Status.error }),
}));
