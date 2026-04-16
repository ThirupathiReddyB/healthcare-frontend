import FacilityCard from "../../components/cards/FacilityCard";
import NoContentCard from "../../components/cards/NoContentCard";
import { AdvFacSkeleton } from "../../components/skeleton/contentSkeleton";
import { Facility } from "../../shared/types/contentManagement";

type FacilitySectionProps = {
  isLoading: boolean;
  facilities: Facility[];
};

const FacilitySection = ({ isLoading, facilities }: FacilitySectionProps) => {

  if (isLoading) {
    return <AdvFacSkeleton />;
  }

  return (
    <>
      {facilities?.length != 0 ? (
        facilities?.map((item: Facility) => {
          return (
            <FacilityCard
              key={item.id}
              id={item.id}
              primaryName={`${item.facPrimaryName}`}
              secondaryName={`${item.facSecondaryName}`}
              phoneNumber={`${item.facPhoneNumber}`}
              address={`${item.facAddress}`}
              speciality={item.facSpeciality}
              facilityType={`${item.facType}`}
              pinCode={`${item.facPincode}`}
              status={item.isActive}
              imageURL={`${item.facImageURL}`}
            />
          );
        })
      ) : (
        <NoContentCard contentType={"Facilities"} />
      )}
    </>
  );
};

export default FacilitySection;
