import { Route, Routes } from "react-router-dom";
import SignIn from "../../pages/auth/SignIn";
import Sidebar from "../../pages/layout/RootLayout";
import Dashboard from "../../pages/dashboard/Dashboard";
import Users from "../../pages/users/Users";
import Reports from "../../pages/reports/Reports";
import ContentManagement from "../../pages/contentmanagment/ContentManagement";
import AdminAuditor from "../../pages/adminauditor/AdminAuditor";
import Feedback from "../../pages/feedback/Feedback";
import UserProfile from "../../pages/users/UserProfile";
import VideosList from "../../pages/contentmanagment/VideoList";
import AdvertiseList from "../../pages/contentmanagment/AdvertiseList";
import Facilities from "../../pages/contentmanagment/Facilities";
import Complaint from "../../pages/feedback/Complaint";
import FeedbackDetails from "../../pages/feedback/FeedbackDetails";
import ComplaintDetails from "../../pages/feedback/ComplaintDetails";
import PrivateRoute from "../../components/privateRoutes/PrivateRoute";
import { NotFound } from "../../pages/notFound/NotFound";

const AllRoutes = () => {
 
  return (
    <Routes>
      <Route index element={<SignIn />} />
      <Route element={<Sidebar />}>
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserProfile />} />
          <Route path="reports" element={<Reports />} />
          <Route path="contentmanagement" element={<ContentManagement />} />
          <Route path="adminauditor" element={<AdminAuditor />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="complaint" element={<Complaint />} />
          <Route path="contentmanagement/videos" element={<VideosList />} />
          <Route
            path="contentmanagement/advertise"
            element={<AdvertiseList />}
          />
          <Route path="contentmanagement/facilities" element={<Facilities />} />
          <Route path="feedback/:id" element={<FeedbackDetails />} />
          <Route path="complaint/:id" element={<ComplaintDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
