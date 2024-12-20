import { ResidentRequestCollation } from "@/types/resident-request-collation";
import dayjs from "dayjs";

interface RouteListProps {
  routes?: ResidentRequestCollation[]; // Mark as optional to allow default value
}

export default function RouteList({ routes = [] }: RouteListProps) {
  console.log("8 routes", routes);
  // Default to an empty array
  return (
    <ul className="max-w-md divide-y divide-gray-200 mt-4">
      {routes.length > 0 ? (
        routes.map((route) => (
          <li key={route.id} className="pb-3 sm:pb-4 p-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {route.applicantName || route.user.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {`${route.address.streetNumber} ${route.address.streetName}, ${route.address.city}`}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  ETA: {dayjs(route.estimatedArrivalTime).format("h:mm A")}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Status: {route.status}
                </p>
              </div>
              <div className="inline-flex items-center text-sm text-simmpy-gray-200">
                <button className="text-simmpy-green">Mark as complete</button>
              </div>
            </div>
          </li>
        ))
      ) : (
        <li className="pb-3 sm:pb-4 rounded-md p-4 text-center">
          <p className="text-sm text-gray-500">No routes available.</p>
        </li>
      )}
    </ul>
  );
}
