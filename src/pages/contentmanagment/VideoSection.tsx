import NoContentCard from "../../components/cards/NoContentCard";
import { VideoSkeleton } from "../../components/skeleton/contentSkeleton";
import VideosListTable from "../../components/tables/VideosListTable";

type VideoSectionProps = {
  isLoading: boolean;
  videoData: any;
};

const VideoSection = ({ isLoading, videoData }: VideoSectionProps) => {
  if (isLoading) {
    return <VideoSkeleton />;
  }

  return (
    <>
      {videoData?.videos?.length ? (
        <VideosListTable pagination={false} cmsData={videoData} />
      ) : (
        <NoContentCard contentType={"Videos"} />
      )}
    </>
  );
};

export default VideoSection;
