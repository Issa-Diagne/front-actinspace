import { useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface NotificationConfig {
  title: string;
  description: string;
  priority: NotificationPriority;
  sound?: boolean;
  persistent?: boolean;
}

// Sound URLs (using Web Audio API for synthesis)
const generateAlertSound = (priority: NotificationPriority) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Different frequencies for different priorities
  const frequencies = {
    low: 440,
    medium: 587,
    high: 784,
    critical: 1047,
  };

  oscillator.frequency.value = frequencies[priority];
  oscillator.type = 'sine';

  // Volume and duration based on priority
  const durations = {
    low: 0.2,
    medium: 0.3,
    high: 0.5,
    critical: 0.8,
  };

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + durations[priority]);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + durations[priority]);

  // For critical alerts, play multiple beeps
  if (priority === 'critical') {
    setTimeout(() => generateAlertSound('critical'), 300);
  }
};

export function useNotifications() {
  const { toast } = useToast();
  const audioEnabledRef = useRef(true);
  const pushEnabledRef = useRef(false);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        pushEnabledRef.current = permission === 'granted';
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      pushEnabledRef.current = true;
    }
  }, []);

  const notify = useCallback((config: NotificationConfig) => {
    const {
      title,
      description,
      priority,
      sound = true,
      persistent = false,
    } = config;

    // Show toast notification
    const variant = 
      priority === 'critical' ? 'destructive' :
      priority === 'high' ? 'destructive' :
      'default';

    toast({
      title,
      description,
      variant,
      duration: persistent ? Infinity : priority === 'critical' ? 10000 : 5000,
    });

    // Play sound
    if (sound && audioEnabledRef.current) {
      try {
        generateAlertSound(priority);
      } catch (error) {
        console.error('Failed to play alert sound:', error);
      }
    }

    // Show browser notification for high priority
    if ((priority === 'high' || priority === 'critical') && pushEnabledRef.current) {
      try {
        const notification = new Notification(`SDRIC - ${title}`, {
          body: description,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `sdric-${priority}`,
          requireInteraction: priority === 'critical',
          vibrate: priority === 'critical' ? [200, 100, 200] : [200],
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Failed to show browser notification:', error);
      }
    }
  }, [toast]);

  const toggleAudio = useCallback((enabled: boolean) => {
    audioEnabledRef.current = enabled;
  }, []);

  return {
    notify,
    toggleAudio,
    audioEnabled: audioEnabledRef.current,
    pushEnabled: pushEnabledRef.current,
  };
}

// Hook to monitor threats and trigger notifications
export function useThreatMonitoring() {
  const { notify } = useNotifications();
  const lastThreatRef = useRef<string | null>(null);

  const monitorThreat = useCallback((threat: any) => {
    // Avoid duplicate notifications
    if (lastThreatRef.current === threat.id) return;
    
    lastThreatRef.current = threat.id;

    const priorityMap: Record<string, NotificationPriority> = {
      low: 'low',
      medium: 'medium',
      high: 'high',
      critical: 'critical',
    };

    notify({
      title: `Menace détectée: ${threat.type}`,
      description: `Cible: ${threat.target} - Sévérité: ${threat.severity}`,
      priority: priorityMap[threat.severity] || 'medium',
      sound: true,
      persistent: threat.severity === 'critical',
    });
  }, [notify]);

  return { monitorThreat };
}
