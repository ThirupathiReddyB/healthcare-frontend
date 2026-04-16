import NoContentCard from "../../components/cards/NoContentCard";
import AdvertiseCard from "../../components/cards/AdvertiseCard";
import { Advertisement } from "../../shared/types/contentManagement";
import { AdvFacSkeleton } from "../../components/skeleton/contentSkeleton";

type AdvertiseSectionProps = {
  isLoading: boolean;
  advertisements: Advertisement[];
};

const AdvertiseSection = ({
  isLoading,
  advertisements,
}: AdvertiseSectionProps) => {
    
  if (isLoading) {
    return <AdvFacSkeleton />;
  }

  return (
    <>
      {advertisements?.length != 0 ? (
        advertisements?.map((item: Advertisement) => {
          return (
            <AdvertiseCard
              key={item.id}
              id={item.id}
              title={`${item.advName}`}
              link={`${item.advSourceUrl}`}
              redirectLink={`${item.advRedirectLink}`}
              priority={`${item.priority}`}
              position={`${item.advPosition}`}
              status={item.isActive}
              subscriptionType={`${item.isSubscribed}`}
            />
          );
        })
      ) : (
        <NoContentCard contentType={"Advertisements"} />
      )}
    </>
  );
};

export default AdvertiseSection;
