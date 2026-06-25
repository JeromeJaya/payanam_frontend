export default function InputBox({ label, value }) {
  return (
    <div className="border rounded-xl p-3">
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="font-semibold">{value}</h3>
    </div>
  );
}