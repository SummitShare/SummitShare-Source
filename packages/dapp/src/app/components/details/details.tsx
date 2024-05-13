export default function Details({
  title,
  info,
}: {
  title: string;
  info: string;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-gray-950">{title}</h1>
        <p className="text-gray-700 text-sm">{info}</p>
      </div>
    </div>
  );
}
