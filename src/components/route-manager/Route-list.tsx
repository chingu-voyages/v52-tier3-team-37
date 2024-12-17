import { ResidentRequestCollation } from "@/types/resident-request-collation";
import dayjs from "dayjs";

interface RouteListProps {
  routes?: ResidentRequestCollation[]; // Mark as optional to allow default value
}

export default function RouteList({ routes = [] }: RouteListProps) {
  return (
    <ul className="max-w-md divide-y divide-gray-200 mt-4">
      {routes.length > 0 ? (
        routes.map((route) => {
          // Calculate ETA based on duration
          const currentTime = dayjs(); // Current time
          const travelTimeInSeconds = parseInt(route.route?.duration?.replace("s", ""), 10) || 0;
          const etaTime = currentTime.add(travelTimeInSeconds, "seconds").format("hh:mm A"); // Add travel time

          // const streetNumber = route.address?.streetNumber ?? "N/A";
          // const streetName = route.address?.streetName ?? "N/A";
          // const city = route.address?.city ?? "N/A";

          const address = route.address
            ? `${route.address.streetNumber ?? "N/A"} ${route.address.streetName ?? "N/A"}, ${route.address.city ?? "N/A"}`
            : "Address unavailable";

          return (
            <li key={route.id} className="pb-3 sm:pb-4 rounded-md p-4">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {route.user.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {address}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    ETA: {route.route?.duration ? etaTime : "N/A"} {/* Display calculated ETA */}
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
          );
        })
      ) : (
        <li className="pb-3 sm:pb-4 rounded-md p-4 text-center">
          <p className="text-sm text-gray-500">No routes available.</p>
        </li>
      )}
    </ul>
  );
}
