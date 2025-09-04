import Image from 'next/image';
import React from 'react';

const RecentPodcasts = () => {
  const podcasts = [
    {
      thumbnail: "/Assets/podcast.avif",
      tooltip: "Podcast 1",
      date: "26 Jul"
    },
    {
      thumbnail: "/Assets/podcast.avif",
      tooltip: "Podcast 2",
      date: "28 Jul"
    },
    {
      thumbnail: "/Assets/podcast.avif",
      tooltip: "Podcast 3",
      date: "29 Jul"
    },
  ];

  return (
    <div className="font-poppins px-8 py-8 flex items-start justify-start flex-col gap-y-6">
      <h1 className="text-xl font-semibold">Recent Podcasts</h1>

      {/* Display Recent Podcasts */}
      <div className="grid grid-cols-4 w-full gap-x-4">
        {podcasts.map((podcast, id) => (
          <div className="w-full h-full cursor-pointer relative group" key={id}>
            <Image
              src={podcast.thumbnail}
              width={105}
              height={75}
              alt={podcast.tooltip}
              className="w-full h-full rounded-md object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 rounded-md transition-all duration-300 py-4"></div>

            {/* Text */}
            <div className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white text-sm font-poppins z-10">
              <p>{podcast.tooltip}</p>
              <p className="text-xs text-muted">{podcast.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPodcasts;
