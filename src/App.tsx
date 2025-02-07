import { Routes, BrowserRouter, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import ListVideos from "@/pages/ListVideos";
import DetailVideo from "./pages/DetailVideo";
import SearchPage from "./pages/SearchPage";
import DetailChanel from "./pages/DetailChanel";
import Playlists from "./pages/Playlists";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ListVideos />} />
          <Route path="watch/:videoId" element={<DetailVideo />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="chanel/:chanelId" element={<DetailChanel />} />
          <Route path="chanel/:chanelId/playlists" element={<Playlists />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
