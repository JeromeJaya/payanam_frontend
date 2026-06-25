export default function Demo() {
  return (
     <div className="grid grid-row-3 gap-4 p-4 px-10 border">
      <div className="col-span-3 grid grid-cols-subgrid gap-4 border p-4">
        <div className="bg-red-200 p-4">A</div>
        <div className="bg-blue-200 p-4">B</div>
        <div className="bg-green-200 p-4">C</div>
        <div className="bg-red-200 p-4">A</div>
        <div className="bg-blue-200 p-4">B</div>
        <div className="bg-green-200 p-4">C</div>
      </div>
      <div className="col-span-3 grid grid-cols-subgrid gap-4 border p-4">
        <div className="bg-red-200 p-4">A</div>
        <div className="bg-blue-200 p-4">B</div>
        <div className="bg-green-200 p-4">C</div>
        <div className="bg-red-200 p-4">A</div>
        <div className="bg-blue-200 p-4">B</div>
        <div className="bg-green-200 p-4">C</div>
        <div className="bg-red-200 p-4">A</div>
        <div className="bg-blue-200 p-4">B</div>
        <div className="bg-green-200 p-4">C</div>
      </div>
    </div>
  );
}