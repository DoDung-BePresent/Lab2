import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from '../assets/scss/ShortPage.module.scss'; 
import { PrevIcon } from '../components/icon/PrevIcon';
import { NextIcon } from '../components/icon/NextIcon';
import { LikeIcon } from '../components/icon/LikeIcon';
import { DislikeIcon } from '../components/icon/DislikeIcon';
import { CommentIcon } from '../components/icon/CommentIcon';
import { ShareShortIcon } from '../components/icon/ShareShortIcon';
const API_KEY = "AIzaSyDzZDdhYi6uUBDiEAqPoYEO903D9Rg1cgE";

const getShortVideos = async (channelId: string) => {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: 'snippet',
        channelId: channelId,
        maxResults: 50,
        type: 'video',
        videoDuration: 'short',
        key: API_KEY,
        order: 'date',
      },
    });

    const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');

    const statsResponse = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        part: 'statistics',
        id: videoIds,
        key: API_KEY,
      },
    });

    const videos = response.data.items.map((item: any) => {
      const stats = statsResponse.data.items.find((stat: any) => stat.id === item.id.videoId);
      return { ...item, statistics: stats.statistics };
    });

    return videos;
  } catch (error) {
    console.error('Error fetching data:', JSON.stringify(error, null, 2));
    return [];
  }
};

const ShortPage: React.FC = () => {
  const [shorts, setShorts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchShorts() {
      const videos = await getShortVideos('UCAhfSPCb_HzvHSI54YCZ6GA');
      setShorts(videos);
    }

    fetchShorts();
  }, []);

  useEffect(() => {
    if (shorts.length > 0) {
      console.log('Current video statistics:', shorts[currentIndex].statistics);
    }
  }, [currentIndex, shorts]);

  const handleNextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % shorts.length);
  };

  const handlePrevVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + shorts.length) % shorts.length);
  };

  return (
    <div className={style.shortPageContainer}>
      {shorts.length > 0 && (
        <div className={style.shortCard}>
          <iframe
            src={`https://www.youtube.com/embed/${shorts[currentIndex].id.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
            className={style.thumbnail}
          ></iframe>
          <div className={style.infoOverlay}>
            <h3 className={style.title}>{shorts[currentIndex].snippet.title}</h3>
            <p className={style.channel}>{shorts[currentIndex].snippet.channelTitle}</p>
          </div>
        </div>
      )}
      <div className={style.actionsVertical}>
        <div className={style.actionButton} style={{display: 'flex', flexDirection: 'column'}}>
          <LikeIcon />
          {shorts.length > 0 && <span>{shorts[currentIndex].statistics.likeCount}</span>}
        </div>
        <div className={style.actionButton}>
          <DislikeIcon />
        </div>
        <div className={style.actionButton}style={{display: 'flex', flexDirection: 'column'}}>
          <CommentIcon />
          {shorts.length > 0 && <span>{shorts[currentIndex].statistics.commentCount}</span>}
        </div>
        <div className={style.actionButton}>
          <ShareShortIcon />
        </div>
      </div>
      <div className={style.buttonContainer}>
        <button type="button" className={style.prevButton} onClick={handlePrevVideo} title="Previous Video">
          <PrevIcon />
        </button>
        <button type="button" className={style.nextButton} onClick={handleNextVideo} title="Next Video">
          <NextIcon />
        </button>
      </div>
    </div>
  );
};

export default ShortPage;