import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import YouTube from "react-youtube";
const HomeSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    // YouTube Video ID (Extracted from the URL)
    const videoId = "FRQTkcWrZbU";
    const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;

    // YouTube Thumbnail URL
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;


    const videoOptions = {
        playerVars: {
            autoplay: 1, // Auto-start video
            mute: 1,     // Mute video
        },
    };

    // Handle Video End (Restart Video)
    const handleVideoEnd = (event) => {
        event.target.playVideo(); // Restart the video
    };

    return (
        <section className="flex flex-col lg:flex-row items-center justify-between px-8 py-12 bg-white">
            {/* Left Content */}
            <div className="max-w-xl space-y-4">
                <Badge className="bg-green-100 text-[#09B96D] text-lg hover:bg-green-200 px-3 py-1 rounded-xl">
                    Working for your success
                </Badge>

                <h1 className="text-4xl font-normal leading-tight text-[#07060D] font-primary">
                    Smart Investments <br />
                    Brighter Future With <br />
                    <span className="text-[#09B96D] text-6xl font-bold">Amazon JV</span>
                </h1>

                <p className="text-gray-600 text-lg">
                    Discover tailored investment opportunities to achieve your financial goals.
                    Start your journey toward financial freedom with our expert-driven strategies and tools.
                </p>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg">
                    Investment Calculator
                </Button>
            </div>

            {/* Right Content (YouTube Video Section) */}
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0 relative group">

                {/* <iframe
                    src={youtubeUrl}
                    className="rounded-lg w-full h-[250px] lg:h-[400px]"
                    allow="autoplay"
                    allowFullScreen
                /> */}

                <YouTube
                    videoId={videoId}
                    opts={videoOptions}
                    className="rounded-lg w-full h-[250px] lg:h-[400px]"
                    onEnd={handleVideoEnd} // Restart video on end
                />


            </div>
        </section>
    );
};

export default HomeSection;
