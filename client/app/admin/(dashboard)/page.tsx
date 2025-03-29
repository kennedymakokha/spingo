// app/admin/dashboard/page.tsx
export default function Dashboard() {
    return (
      <div className="p-6   ">
       
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="text-2xl">1,245</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Active Sessions</h3>
            <p className="text-2xl">320</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Total Revenue</h3>
            <p className="text-2xl">$45,000</p>
          </div>
        </div>
      </div>
    );
  }
  