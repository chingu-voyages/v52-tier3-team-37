// import React, {useState, useEffect} from "react";
// import { collateDailyRequests } from "./collateDailyRequests";


// const CollateDailyRequests = () => {
//     const [requests, setRequests] = useState([]);
  
//     useEffect(() => {
//       async function fetchData() {
//         try {
//           const data = await collateDailyRequests();
//           setRequests(data);
//         } catch (error) {
//           console.error("Error fetching daily requests:", error);
//         }
//       }
  
//       fetchData();
//     }, []);
  
//     return (
//       <div>
//         <h2>Daily Requests</h2>
//         <ul>
//           {requests.map((req) => (
//             <li key={req.id}>{req.user.name} - {req.address.city}</li>
//           ))}
//         </ul>
//       </div>
//     );
//   };
  
//   export default CollateDailyRequests;

