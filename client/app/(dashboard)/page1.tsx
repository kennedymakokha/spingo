"use client";


import { motion } from "framer-motion";

import Link from "next/link";


const page = () => {
  const games = [{
    title: "Spin",
    desc: "spin to win",
    path: 'spin'
  },
  {
    title: "Spin",
    desc: "spin to win",
    path: 'spin'
  }]
  return (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((_, i) => (
        <Link key={i} href={_.path}>
          <motion.div

            className="p-6 bg-gray-800 rounded-lg shadow-lg"
            whileHover={{ boxShadow: "0px 0px 12px #00f2ff" }}
          >
            <h3 className="text-xl font-semibold mb-2">{_.title}</h3>
            <p className="text-gray-400">{_.desc}</p>
          </motion.div>
        </Link>
      ))}
    </div>


  )
}

export default page;
