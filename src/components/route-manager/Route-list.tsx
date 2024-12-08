export default function RouteList() {
  return (
    <ul className="max-w-md divide-y divide-gray-200 mt-4">
      <li className="pb-3 sm:pb-4 rounded-md p-4">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Resident's First and Last name
            </p>
            <p className="text-sm text-gray-500 truncate">Resident's Address</p>
            <p className="text-sm text-gray-500 truncate">Optimized ETA</p>
            <p className="text-sm text-gray-500 truncate">Status</p>
          </div>
          <div className="inline-flex items-center text-sm text-simmpy-gray-200 ">
            <button className="text-simmpy-green">Mark as complete</button>
          </div>
        </div>
      </li>
    </ul>
  );
}
