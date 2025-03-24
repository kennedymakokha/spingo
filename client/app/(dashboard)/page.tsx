"use client";


import { motion } from "framer-motion";

import Link from "next/link";

// const Dashboard = () => {
//   const { user, logout } = useAuth();

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>Welcome, {user.phone_number}</h2>
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// };

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
    <>

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
    </>

  )
}

export default page;
