export default function Notice({ type = "info", children }) {
  const color =
    type === "error" ? "bg-red-50 text-red-700 border-red-200"
    : type === "success" ? "bg-green-50 text-green-700 border-green-200"
    : "bg-blue-50 text-blue-700 border-blue-200";
  return (
    <div className={`border rounded-md px-3 py-2 text-sm ${color}`}>
      {children}
    </div>
  );
}
