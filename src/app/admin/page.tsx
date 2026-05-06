// app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">
        Welcome to the admin dashboard. Manage your store data here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Products</h3>
          <p className="text-gray-500">Add, edit or delete products</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Orders</h3>
          <p className="text-gray-500">Manage customer orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Users</h3>
          <p className="text-gray-500">View registered users</p>
        </div>
      </div>
    </div>
  );
}
