import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import ListVideos from "@/pages/ListVideos";
import DetailVideo from "./pages/DetailVideo";
import SearchPage from "./pages/SearchPage";
import DetailChanel from "./pages/DetailChanel";
import Playlists from "./pages/Playlists";
import NotFound from "./pages/NotFound";
import PlaylistItems from "./pages/PlaylistItems";
import { AuthProvider } from "@/contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/callback" element={<Navigate to="/" />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<ListVideos />} />
            <Route path="watch/:videoId" element={<DetailVideo />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="chanel/:chanelId" element={<DetailChanel />} />
            <Route path="feed/playlists" element={<Playlists />} />
            <Route path="playlists/:playlistId" element={<PlaylistItems />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
