import { AllUserRequestsAdminGetResponse } from "@/types/api-responses/admin-resident-requests-api-response";
import { RequestStatus } from "@prisma/client";

export const ActionButtons = ({
  request,
  onActionButtonClicked,
}: {
  request: AllUserRequestsAdminGetResponse;
  onActionButtonClicked: (requestStatus: RequestStatus) => void;
}) => {
  const statuses: RequestStatus[] = [
    RequestStatus.PENDING,
    RequestStatus.COMPLETED,
    RequestStatus.CANCELED,
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((status) => {
        let bgColor = "";
        let hoverColor = "";

        if (status === RequestStatus.COMPLETED) {
          bgColor = "bg-green-500";
          hoverColor = "hover:bg-green-600";
        } else if (status === RequestStatus.PENDING) {
          bgColor = "bg-yellow-500";
          hoverColor = "hover:bg-yellow-600";
        } else if (status === RequestStatus.CANCELED) {
          bgColor = "bg-red-500";
          hoverColor = "hover:bg-red-600";
        }

        const isCurrent = request.status === status;

        return (
          <button
            key={status}
            style={{
              color: status === RequestStatus.PENDING ? "black" : "white",
            }}
            className={`${bgColor} ${hoverColor} text-slate px-4 py-2 rounded transition  ${
              isCurrent ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !isCurrent && onActionButtonClicked(status)}
            disabled={isCurrent}
          >
            Set as {status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        );
      })}
    </div>
  );
};
