// import { useRouter } from 'next/navigation';
// import { useEffect, useContext } from 'react';
// import { AuthContext } from '@/context/context';

// const AdminPage = () => {
//   const { isAuth, isAdmin } = useContext(AuthContext);
//   const router = useRouter();

//   useEffect(() => {
//     if (!isAuth || !isAdmin) {
//       router.push('/signin'); // Redirect if not authenticated or not an admin
//     }
//   }, [isAuth, isAdmin, router]);

//   if (!isAuth || !isAdmin) {
//     return <p>Loading...</p>; // Optional: loading state
//   }

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       <p>Welcome to the admin-only area!</p>
//       {/* Add admin-specific content here */}
//     </div>
//   );
// };

// export default AdminPage;
export default function adminPage() {
    return (
      <div>
        admin page
      </div>
    );
  }