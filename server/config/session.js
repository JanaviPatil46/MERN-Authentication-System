// The only session lengths users can pick. Keys are what the client sends.
export const SESSION_DURATIONS = {
  "5m": 5 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "4h": 4 * 60 * 60 * 1000,
  "8h": 8 * 60 * 60 * 1000,
};

// Returns a valid duration key: the requested one, else the .env default, else 30m
export function resolveDuration(requested) {
  if (SESSION_DURATIONS[requested]) return requested;
  if (SESSION_DURATIONS[process.env.JWT_EXPIRES_IN]) return process.env.JWT_EXPIRES_IN;
  return "30m";
}
