import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Menu, Search } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../../features/auth/authSlice";
import { researchAreas } from '../../config/menuConfig'

export default function Navbar({ navLinks }) {
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch()

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight">
          MyLogo
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">

              {/* Research */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent text-sm font-medium">
                  <Link
                    to='/research'
                    className="text-sm font-medium hover:text-primary transition"
                  >
                    Research
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-0">
                  <div className="w-80 bg-white shadow-xl rounded-md overflow-hidden">
                    <ul className="divide-y divide-gray-300">

                      {researchAreas.map((area) => (
                        <Link key={area.slug} to={`/research/${area.slug}`}>
                          <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">
                            {area.name}
                          </li>
                        </Link>
                      ))}

                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Events */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent text-sm font-medium">
                  Events
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p=0">
                  <div className="w-80 bg-white shadow-xl rounded-md overflow-hidden">
                    <ul className="space-y-3 divide-y divide-gray-300">
                      <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Conclave</li>
                      <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Conference</li>
                      <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Workshop</li>
                      <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Roundtables</li>
                      <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Track-II Dialogues</li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* News */}
              <NavigationMenuItem>
                <NavigationMenuTrigger >
                  News
                </NavigationMenuTrigger>
                {/* <NavigationMenuContent>
                  <div className="w-64 bg-[#fff] p-6 text-black shadow-xl"></div>
                </NavigationMenuContent> */}
              </NavigationMenuItem>

              {/* Membership */}
              <NavigationMenuItem>
                <NavigationMenuTrigger >
                  Membership
                </NavigationMenuTrigger>
                {/* <NavigationMenuContent>
                  <div className="w-64 bg-[#fff] p-6 text-black shadow-xl"></div>
                </NavigationMenuContent> */}
              </NavigationMenuItem>

              {/* About */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent text-sm font-medium">
                  About Us
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-80 bg-white shadow-xl rounded-md overflow-hidden">
                    <ul className="space-y-3 divide-y divide-gray-300">
                      <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Leadership</li>
                      <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Mission</li>
                      <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Our Team</li>
                      <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Careers</li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>

          {/* Donate Button */}
          <Button className="rounded-xl">Donate</Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 w-48"
            />
          </div>

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>

              <Link to="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => dispatch(logoutUser())}
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.name} asChild>
                  <Link to={link.path}>{link.name}</Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuItem asChild>
                <Link to="/donate">Donate</Link>
              </DropdownMenuItem>


              {!user ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>

                  <Link to="/register">
                    <Button variant="outline">Register</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => dispatch(logoutUser())}
                  >
                    Logout
                  </Button>
                </>
              )}

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
