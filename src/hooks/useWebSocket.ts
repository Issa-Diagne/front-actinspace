import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: 'satellite_update' | 'threat_detected' | 'communication_update' | 'system_status';
  data: any;
  timestamp: string;
}

export function useWebSocket(url: string = 'ws://localhost:8080') {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // For demo purposes, we'll simulate WebSocket with mock data
    // In production, replace this with actual WebSocket connection
    const simulateWebSocket = () => {
      setIsConnected(true);

      const interval = setInterval(() => {
        const messageTypes: WebSocketMessage['type'][] = [
          'satellite_update',
          'threat_detected',
          'communication_update',
          'system_status',
        ];

        const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
        
        let data;
        switch (randomType) {
          case 'satellite_update':
            data = {
              satelliteId: `SAT-00${Math.floor(Math.random() * 6) + 1}`,
              signalStrength: Math.floor(Math.random() * 40) + 60,
              status: Math.random() > 0.9 ? 'warning' : 'online',
            };
            break;
          case 'threat_detected':
            data = {
              threatId: `THR-${Date.now()}`,
              type: ['jamming', 'spoofing', 'intrusion'][Math.floor(Math.random() * 3)],
              severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
              target: `SAT-00${Math.floor(Math.random() * 6) + 1}`,
            };
            break;
          case 'communication_update':
            data = {
              channelId: `CH-${Math.floor(Math.random() * 5) + 1}`,
              bandwidth: Math.floor(Math.random() * 40) + 60,
              latency: Math.floor(Math.random() * 100) + 10,
            };
            break;
          case 'system_status':
            data = {
              uptime: 99.97,
              activeThreats: Math.floor(Math.random() * 3),
              activeSatellites: 6,
            };
            break;
        }

        const message: WebSocketMessage = {
          type: randomType,
          data,
          timestamp: new Date().toISOString(),
        };

        setLastMessage(message);
      }, 5000); // Update every 5 seconds

      return () => {
        clearInterval(interval);
        setIsConnected(false);
      };
    };

    const cleanup = simulateWebSocket();

    return cleanup;
  }, [url]);

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
}

export function useRealtimeUpdates() {
  const { lastMessage } = useWebSocket();
  const [satellites, setSatellites] = useState<Map<string, any>>(new Map());
  const [threats, setThreats] = useState<any[]>([]);
  const [communications, setCommunications] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'satellite_update':
        setSatellites((prev) => {
          const updated = new Map(prev);
          updated.set(lastMessage.data.satelliteId, lastMessage.data);
          return updated;
        });
        break;

      case 'threat_detected':
        setThreats((prev) => [lastMessage.data, ...prev].slice(0, 50));
        break;

      case 'communication_update':
        setCommunications((prev) => {
          const updated = new Map(prev);
          updated.set(lastMessage.data.channelId, lastMessage.data);
          return updated;
        });
        break;
    }
  }, [lastMessage]);

  return {
    satellites: Array.from(satellites.values()),
    threats,
    communications: Array.from(communications.values()),
    lastUpdate: lastMessage?.timestamp,
  };
}
