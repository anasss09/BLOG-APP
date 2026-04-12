import Sidebar from "./Sidebar"

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
