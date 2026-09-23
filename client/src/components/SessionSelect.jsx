// Values must match the keys in server/config/session.js
export const SESSION_OPTIONS = [
  { value: "5m", label: "5 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "4h", label: "4 hours" },
  { value: "8h", label: "8 hours" },
];

export default function SessionSelect({ value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="duration">Keep me signed in for</label>
      <select id="duration" name="duration" value={value} onChange={onChange}>
        {SESSION_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
