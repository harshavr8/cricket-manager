export default function Loading({ label = "Loading…" }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <span className="animate-spin inline-block h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full"></span>
      <span>{label}</span>
    </div>
  );
}
