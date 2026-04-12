import { Link } from "react-router-dom"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronUp
} from "lucide-react"

import {
  researchAreas,
  regions,
  publications,
  events
} from "../../config/menuConfig"

export default function Footer() {

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-gray-100 text-gray-700 pt-14 pb-6">

      <div className="max-w-7xl mx-auto px-6">

        {/* GRID */}
        <div className="grid md:grid-cols-5 gap-12">

          {/* LEFT SECTION */}
          <div className="space-y-6">

            <h2 className="text-3xl font-semibold leading-snug text-gray-900">
              MYBLOG <br /> FOUNDATION
            </h2>

            <p className="leading-relaxed text-gray-600">
              An independent policy research institution advancing informed
              dialogue on global and regional affairs.
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-4">

              <span className="font-semibold text-gray-800">
                FOLLOW US:
              </span>

              <a href="#" className="hover:text-blue-600">
                <Facebook size={18}/>
              </a>

              <a href="#" className="hover:text-blue-600">
                <Twitter size={18}/>
              </a>

              <a href="#" className="hover:text-blue-600">
                <Instagram size={18}/>
              </a>

              <a href="#" className="hover:text-blue-600">
                <Youtube size={18}/>
              </a>

            </div>
          </div>


          {/* RESEARCH AREAS */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-gray-900">
              Research Areas
            </h3>

            <ul className="space-y-3 text-gray-600">

              {researchAreas.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="no-underline hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>


          {/* REGIONS */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-gray-900">
              Regions
            </h3>

            <ul className="space-y-3 text-gray-600">

              {regions.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="no-underline hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>


          {/* PUBLICATIONS */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-gray-900">
              Publications
            </h3>

            <ul className="space-y-3 text-gray-600">

              {publications.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="no-underline hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>


          {/* EVENTS */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-gray-900">
              Events
            </h3>

            <ul className="space-y-3 text-gray-600">

              {events.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="no-underline hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

        </div>


        {/* BOTTOM */}
        <div className="border-t border-gray-300 mt-12 pt-6 flex items-center justify-between">

          <p className="mx-auto text-sm text-gray-600">
            © 2025, MyBlog Foundation
          </p>

          <button
            onClick={scrollTop}
            className="flex items-center gap-1 text-sm hover:text-blue-600"
          >
            <ChevronUp size={16}/>
            Top
          </button>

        </div>

      </div>

    </footer>
  )
}