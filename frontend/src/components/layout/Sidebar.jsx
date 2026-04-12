import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

const menu = [
  { name: "Dashboard", path: "/admin", roles: ["admin","editor","member"] },
  { name: "Posts", path: "/admin/posts", roles: ["admin","editor"] },
  { name: "Users", path: "/admin/users", roles: ["admin"] },
  { name: "Settings", path: "/admin/settings", roles: ["admin"] },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const user = useSelector((s) => s.auth.user)

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="font-bold text-lg mb-6">Admin Panel</h2>

      {menu
        .filter(item => item.roles.includes(user?.role))
        .map(item => (
          <Link
            key={item.name}
            to={item.path}
            className={`block p-2 rounded mb-2 ${
              pathname === item.path ? "bg-primary text-white" : "hover:bg-muted"
            }`}
          >
            {item.name}
          </Link>
        ))}
    </aside>
  )
}
