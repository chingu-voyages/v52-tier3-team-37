"use client";

import Spinner from "@/components/spinner/Spinner";
import { collateDailyRequests } from "@/services/collateDailyRequests/collateDailyRequests";
import { googleMapsLoader } from "@/services/collateDailyRequests/loader";
import { ResidentRequestCollation } from "@/types/resident-request-collation";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RouteList from "./Route-list";

interface RouteManagerProps {
  dateValue: string;
}

export default function RouteManager({ dateValue }: RouteManagerProps) {
  const { data: session, status } = useSession();
  const webRouter = useRouter();
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const [filteredRequests, setFilteredRequests] = useState<
    ResidentRequestCollation[]
  >([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      webRouter.replace("/authenticate");
    }
  }, [status, webRouter]);

  const handleCollateDailyRequests = async () => {
    try {
      setIsBusy(true);
      const formattedDate = dayjs(dateValue.toString()).format("YYYY-MM-DD");
      const result = await collateDailyRequests(formattedDate);

      if (result.length === 0) {
        console.warn("No routes found for the selected date.");
        return;
      }

      setFilteredRequests(result); // Pass filtered data to RouteList

      if (googleMap) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: googleMap,
        });

        // Set the starting point, ending point, and waypoints
        const waypoints = result.slice(1, -1).map((request) => ({
          location: {
            lat: request.address.latitude,
            lng: request.address.longitude,
          },
          stopover: true,
        }));

        const routeRequest: google.maps.DirectionsRequest = {
          origin: {
            lat: result[0].address.latitude,
            lng: result[0].address.longitude,
          },
          destination: {
            lat: result[result.length - 1].address.latitude,
            lng: result[result.length - 1].address.longitude,
          },
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        };

        directionsService.route(routeRequest, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Error generating directions:", status);
          }
        });
        setIsBusy(false);
      }
    } catch (error) {
      setIsBusy(false);
      console.error("Error handling collate daily requests:", error);
    }
  };

  useEffect(() => {
    async function initMap() {
      const mapElement = document.getElementById("gmap") as HTMLElement;
      if (!mapElement) return;

      await googleMapsLoader.load();

      const map = new google.maps.Map(mapElement, {
        center: { lat: 34.0522, lng: -118.2437 }, // Default to Los Angeles
        zoom: 10,
      });

      setGoogleMap(map);
    }

    initMap();
  }, []);

  return (
    <>
      {session?.user?.isAdmin ? (
        <div className="p-2">
          <div>
            <h2 className="text-3xl font-bold text-center">
              Route Optimization for{" "}
              {dayjs(dateValue.toString()).format("MMM-DD-YYYY")}
            </h2>
          </div>
          <div className="my-4">
            <div>
              <div className="my-6 md:flex md:justify-center">
                <button
                  onClick={handleCollateDailyRequests}
                  className="bg-simmpy-blue py-2 rounded-md w-full md:w-1/2"
                  disabled={isBusy}
                >
                  <div className="flex justify-center">
                    {isBusy && <Spinner size="sm" />}
                    <p className="text-white text-sm ml-2">
                      Generate Optimized Route
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-20 flex-wrap md:justify-center">
            <RouteList routes={filteredRequests} /> {/* Pass routes as props */}
            <div className="h-[300px] w-[500px] w-full" id="gmap"></div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-simmpy-red">Not authorized</p>
        </div>
      )}
    </>
  );
}
