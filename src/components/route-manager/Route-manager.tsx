"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { parseDate } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RouteList from "./Route-list";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY!,
  version: "weekly",
  libraries: ["places", "maps"],
});

export default function RouteManager() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dateValue, setDateValue] = useState(
    parseDate(dayjs().format("YYYY-MM-DD"))
  );

  const [googleMap, setGoogleMap] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/authenticate");
    }
  }, [status, router]);

  useEffect(() => {
    const loadMap = async () => {
      const mapOptions: google.maps.MapOptions = {
        center: { lat: 34.053715, lng: -118.242653 }, // Focus on LA city hall by default
        zoom: 12,
        mapId: "gmap",
      };
      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const htmlElement = document.getElementById("gmap") as HTMLElement;
      if (htmlElement === null) return;
      const map = new Map(htmlElement, mapOptions);
      setGoogleMap(map);

      new AdvancedMarkerElement({
        position: mapOptions.center,
        map: map,
      });

      return () => {
        setGoogleMap(null);
      };
    };
    loadMap();
  }, []);

  return (
    <>
      {session?.user?.isAdmin ? (
        <div className="p-2">
          <div>
            <h1 className="text-3xl font-bold text-center">Route Manager</h1>
          </div>
          <div className="my-4">
            <div>
              <DatePicker
                className="max-w-[284px]"
                description={"Choose a date and click 'Generate Route'"}
                value={dateValue}
                onChange={setDateValue}
              />
              <div className="mt-6">
                <button className="bg-simmpy-blue h-[28px] px-2 rounded-md">
                  <span className="text-white text-sm">Generate Route</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-20 flex-wrap">
            {/* List of visits on the left, google map on the right */}
            <RouteList />
            <div className="h-[300px] w-[500px]" id="gmap"></div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-simmpy-red">Not authorized</h1>
        </div>
      )}
    </>
  );
}
