import FormattedTimeSlotDateTime from "@/components/formatted-time-slot-date-time.tsx/FormattedTimeSlotDateTime";
import { AllUserRequestsAdminGetResponse } from "@/types/api-responses/admin-resident-requests-api-response";
import { statusToColorMap } from "./status-color-map";

export function DaySection({
  title,
  requests,
  onCardClick,
}: {
  title: string;
  requests: AllUserRequestsAdminGetResponse[];
  onCardClick: (req: AllUserRequestsAdminGetResponse) => void;
}) {
  if (requests.length === 0) {
    return (
      <div>
        <h2 className="font-bold mb-2">{title}</h2>
        <p>No requests for this time period.</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="font-bold mb-2">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className={`rounded-lg shadow-lg p-6 hover:shadow-xl transition border-4 cursor-pointer flex flex-col ${
              statusToColorMap[request.status].border
            } ${statusToColorMap[request.status].bg}`}
            onClick={() => onCardClick(request)}
          >
            <div className="flex justify-between w-full mb-4">
              <div className="text-gray-600 font-medium">
                {request.user.name}
              </div>
              <div className="text-gray-600 font-medium">
                <FormattedTimeSlotDateTime
                  start={request.requestedTimeSlot.startTime}
                  end={request.requestedTimeSlot.endTime}
                />
              </div>
            </div>
            <div className="text-gray-700 mb-2">
              {request.address?.city || "Unknown City"},{" "}
              {request.address?.streetName || "Unknown Street"}
            </div>
            <h2
              className={`text-lg font-bold uppercase ${
                statusToColorMap[request.status].text
              }`}
            >
              {request.status}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
