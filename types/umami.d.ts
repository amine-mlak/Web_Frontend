interface UmamiTracker {
  track(
    payload?:
      | string
      | Record<string, unknown>
      | ((props: Record<string, unknown>) => Record<string, unknown>),
    data?: Record<string, unknown>,
  ): void;
}

interface Window {
  umami?: UmamiTracker;
}
