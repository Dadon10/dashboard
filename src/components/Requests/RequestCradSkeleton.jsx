import Skeleton from "react-loading-skeleton";

const RequestCardSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded shadow mb-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="pb-2">
            <Skeleton width={180} height={22} />
          </h3>

          <div className="pb-2">
            <Skeleton width={140} />
          </div>

          <Skeleton width={220} />

          <div className="pt-2">
            <Skeleton width={120} />
          </div>

          <div className="pt-2">
            <Skeleton width={150} />
          </div>
        </div>

        <Skeleton width={70} height={30} borderRadius={8} />
      </div>

      <div className="flex gap-3 mt-4">
        <Skeleton width={80} height={36} borderRadius={6} />
        <Skeleton width={80} height={36} borderRadius={6} />
        <Skeleton width={90} height={36} borderRadius={6} />
        <Skeleton width={80} height={36} borderRadius={6} />
      </div>
    </div>
  );
};

export default RequestCardSkeleton;
