import { jest } from '@jest/globals';


// Mock the useToast hook
export const useToast = jest.fn(() => ({
  show: jest.fn(),
  close: jest.fn(),
  closeAll: jest.fn(),
}));

// Mock the ToastProvider component (if used)
export const ToastProvider = ({ children }) => <>{children}</>;

// Mock the Toast component itself (if directly rendered)
export const Toast = ({ children }) => <>{children}</>;
export const ToastTitle = ({ children }) => <>{children}</>;
export const ToastDescription = ({ children }) => <>{children}</>;
export const ToastAction = ({ children }) => <>{children}</>;
export const ToastCloseButton = ({ children }) => <>{children}</>;