import { SignalRNotification } from '@/types';

export interface SignalREventHandlers {
  ReceiveNotification: (message: SignalRNotification) => void;
  // Add more events here as needed
}