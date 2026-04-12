// // import { useSelector } from "react-redux"
// // import { Navigate } from "react-router-dom"

// // const ProtectedRoute = ({
// //   children,
// //   allowedRoles = []   // optional
// // }) => {
// //   const user = useSelector((state) => state.auth.user)
// //   console.log("ProtectedROute", user);

// //   /* ---------------- NOT LOGGED IN ---------------- */
// //   if (!user) {
// //     return <Navigate to="/login" replace />
// //   }

// //   /* ---------------- ROLE CHECK ---------------- */
// //   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
// //     return <Navigate to="/" replace />
// //   }

// //   /* ---------------- ALLOWED ---------------- */
// //   return children
// // }

// // export default ProtectedRoute

// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({
//   children,
//   allowedRoles = []   // optional
// }) => {
//   const user = useSelector((state) => state.auth.user);
//   console.log("ProtectedRoute - User:", user);

//   // If still loading (user might be null initially)
//   if (user === undefined || user === null) {
//     // You can show a loading spinner here if you want
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   /* ---------------- NOT LOGGED IN ---------------- */
//   if (!user || !user.token) {
//     console.log("ProtectedRoute: User not logged in, redirecting to login");
//     return <Navigate to="/login" replace />;
//   }

//   /* ---------------- ROLE CHECK ---------------- */
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     console.log(`ProtectedRoute: User role ${user.role} not in allowed roles: ${allowedRoles}`);
//     return <Navigate to="/" replace />;
//   }

//   /* ---------------- ALLOWED ---------------- */
//   console.log("ProtectedRoute: Access granted");
//   return children;
// };

// export default ProtectedRoute;


import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRoles = []   // optional
}) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!user) {
    console.log("ProtectedRoute: User not logged in, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  /* ---------------- ROLE CHECK ---------------- */
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`ProtectedRoute: User role ${user.role} not in allowed roles: ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  /* ---------------- ALLOWED ---------------- */
  console.log("ProtectedRoute: Access granted for user:", user);
  return children;
};

export default ProtectedRoute;