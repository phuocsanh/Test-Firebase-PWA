import { TAB_KEY, TOKEN_KEY } from '@/constant';
import { SignalRContext } from '@/context';
import { useAuth } from '@/hooks';
import { getCookie } from '@/lib/cookie';
import { SignalREventHandlers } from '@/types';
import * as signalR from '@microsoft/signalr';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SignalRProviderProps {
  hubUrl: string;
  children: React.ReactNode;
}

export const SignalRProvider = ({ hubUrl, children }: SignalRProviderProps) => {
  const { user } = useAuth();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const startConnection = () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => getCookie<string>(TOKEN_KEY),
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry intervals: immediate, 2s, 10s, 30s
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        console.log('SignalR connection established');
        setIsConnected(true);

        // Start checking connection state every 5 seconds
        // setInterval(() => {
        //   console.log('Connection state:', connectionRef.current?.state);
        // }, 5000);
      })
      .catch(err => {
        console.error('Error establishing SignalR connection', err);
        setIsConnected(false);
      });

    // connection.onreconnected(connectionId => {
    //   console.log('Reconnected triggered.');
    //   console.log('Current connection state:', connection.state);
    //   console.log('Reconnected! Connection ID:', connectionId);
    // });

    connection.onclose(error => {
      console.log('SignalR connection closed.');
      console.log('Close reason:', error ? error.message : 'No error.');
      console.log('Current connection state:', connection.state);
      setIsConnected(false);

      // Tự động thử kết nối lại
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        connection.start().catch(err => console.error('Reconnect failed:', err));
      }, 5000); // 5s
    });
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      // Ngắt kết nối nếu đang kết nối
      connectionRef.current
        ?.stop()
        .then(() => {
          console.log('SignalR connection stopped');
          setIsConnected(false);
        })
        .catch(err => console.error('Error stopping SignalR connection', err));
    } else {
      // Kết nối lại nếu đang ngắt
      startConnection();
    }
  };

  useEffect(() => {
    startConnection();

    const tabCount = parseInt(localStorage.getItem(TAB_KEY) || '0', 10);
    //console.log('tabCount: ', tabCount);
    /// ......khúc này check f5 hay close......
    // Mark session active
    sessionStorage.setItem('isTabClosed', 'false');

    // Handle beforeunload event
    const handleBeforeUnload = () => {
      sessionStorage.setItem('isTabClosed', 'true');
      console.log('Browser/tab is being closed.');
      if (tabCount == 0) {
        // thêm cái này để check nó đóng hết tab chưa
        if (connectionRef.current) {
          const body = {
            userId: user?.userId,
            tabCount: tabCount,
          };
          const headers = {
            type: 'application/json',
          };
          const blob = new Blob([JSON.stringify(body)], headers);
          navigator.sendBeacon(
            `${import.meta.env.VITE_API_URL}` + '/signalr-notify/disconnect',
            blob
          );
        }
      }
    };

    // Handle page load to detect refresh
    const handlePageLoad = () => {
      const isTabClosed = sessionStorage.getItem('isTabClosed') === 'true';

      if (isTabClosed) {
        console.log('Page was closed previously.');
      } else {
        console.log('Page was refreshed or navigated.');
      }

      // Reset sessionStorage flag
      sessionStorage.setItem('isTabClosed', 'false');
    };

    // Add listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handlePageLoad);
    /// ......khúc này check f5 hay close......

    /// khúc này update ok......
    // const handleDisconnect = async () => {
    //   if (connectionRef.current) {
    //     const body = {
    //       userId: user?.userId,
    //     };
    //     const headers = {
    //       type: 'application/json',
    //     };
    //     const blob = new Blob([JSON.stringify(body)], headers);
    //     navigator.sendBeacon('http://localhost:5000/api/signalr-notify/disconnect', blob);
    //   }
    // };
    // window.addEventListener('beforeunload', handleDisconnect);
    /// ........khúc này update ok......

    return () => {
      // Clear component unmounts
      connectionRef.current
        ?.stop()
        .catch(error => console.error('Close SignalR connection failure:', error));
      console.log('SignalR connection closed');
    };
  }, [hubUrl]);

  const on = useCallback(
    <K extends keyof SignalREventHandlers>(event: K, callback: SignalREventHandlers[K]) => {
      connectionRef.current?.on(event, callback);
    },
    []
  );

  const off = useCallback(
    <K extends keyof SignalREventHandlers>(event: K, callback: SignalREventHandlers[K]) => {
      connectionRef.current?.off(event, callback);
    },
    []
  );

  return (
    <SignalRContext.Provider value={{ on, off }}>
      {children}
      <button
        onClick={handleToggleConnection}
        style={{ position: 'fixed', top: 15, right: 60, visibility: 'hidden' }}
      >
        {isConnected ? 'Ngắt kết nối' : 'Kết nối lại'}
      </button>
    </SignalRContext.Provider>
  );
};
