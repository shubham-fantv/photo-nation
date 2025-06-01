import { Box } from "@mui/material";
import React, { useState } from "react";

import LoginAndSignup from "../src/component/feature/Login";
import { useRouter } from "next/router";

const headshots = [
  // Top row - Men
  {
    id: 1,
    src: "/images/photo-studio/home/l1.png",
    alt: "Professional headshot 1",
  },
  {
    id: 2,
    src: "/images/photo-studio/home/l2.png",
    alt: "Professional headshot 2",
  },
  {
    id: 3,
    src: "/images/photo-studio/home/l3.png",
    alt: "Professional headshot 3",
  },
  {
    id: 4,
    src: "/images/photo-studio/home/h1.jpg",
    alt: "Professional headshot 4",
  },
  {
    id: 5,
    src: "/images/photo-studio/home/h2.jpg",
    alt: "Professional headshot 5",
  },
  {
    id: 6,
    src: "/images/photo-studio/home/h3.jpg",
    alt: "Professional headshot 6",
  },

  // Bottom row - Mixed
  {
    id: 7,
    src: "/images/photo-studio/home/l4.png",
    alt: "Professional headshot 7",
  },
  {
    id: 8,
    src: "/images/photo-studio/home/l5.png",
    alt: "Professional headshot 8",
  },
  {
    id: 9,
    src: "/images/photo-studio/home/l6.png",
    alt: "Professional headshot 9",
  },
  {
    id: 10,
    src: "/images/photo-studio/home/h4.jpg",
    alt: "Professional headshot 10",
  },
  {
    id: 11,
    src: "/images/photo-studio/home/h5.jpg",
    alt: "Professional headshot 11",
  },
  {
    id: 12,
    src: "/images/photo-studio/home/h6.jpg",
    alt: "Professional headshot 12",
  },
];
const steps = [
  {
    id: 1,
    title: "Upload Photos",
    description:
      "Easily upload your photos. Clear, well-lit images work best for stunning transformations",
  },
  {
    id: 2,
    title: "Pick any style",
    description:
      "Browse our diverse gallery of professional headshots and lifestyle templates. Find your perfect look",
  },
  {
    id: 3,
    title: "Generate",
    description:
      "Our advanced AI instantly crafts your new image based on your photos and chosen style",
  },
  {
    id: 4,
    title: "Download",
    description:
      "Receive high-resolution results ready for your portfolio, social media, or professional profiles",
  },
];

const useCases = [
  { name: "LinkedIn", icon: "/images/photo-studio/home/linked.png" },
  { name: "Teams", icon: "/images/photo-studio/home/team.png" },
  { name: "Zoom", icon: "/images/photo-studio/home/zoom.png" },
  { name: "Business Cards", icon: "/images/photo-studio/home/card.png" },
  { name: "Email Signature", icon: "/images/photo-studio/home/sms.png" },
  { name: "Social Media", icon: "/images/photo-studio/home/global.png" },
];

const Index = () => {
  const [isPopupVisible, setIsPopupVisible] = useState({
    login: false,
  });

  const router = useRouter();
  const handleLoginPopupClose = () => {
    setIsPopupVisible({ login: false });
  };

  return (
    <div>
      <Box className="min-h-screen text-black bg-[#FFF]">
        <div className="min-h-screen ">
          <div className="max-w-7xl mx-auto p-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <h1 className="text-6xl font-bold bg-gradient-to-b from-[#1B0064] via-[#1B0064] to-[#4719C5] bg-clip-text text-transparent">
                  PhotoNation
                </h1>
              </div>

              <p className="text-[#626262] text-lg mb-8 max-w-md mx-auto">
                Transform your photos into stunning, professional quality AI photos
              </p>

              <button
                style={{
                  background: "linear-gradient(180deg, #FFA0FF 0%, #653EFF 100%)",
                  boxShadow: "0px 0px 17px 0px #FFFFFF8C",
                }}
                className="text-white rounded-full  px-1 py-1 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div
                  onClick={() => router.push("/photo-studio")}
                  className="flex px-4 py-2 rounded-full "
                  style={{ border: "1px solid #FFF" }}
                >
                  <span>Craft Your Perfect Look </span>&nbsp;
                  <img src="/images/photo-studio/home/arrow-right.svg" />
                </div>
              </button>
            </div>

            {/* 100% AI Generated Badge */}
            <div className="flex justify-end mb-8">
              <span className="text-[#653EFF] font-medium italic">100% AI generated</span>
            </div>

            {/* Photo Grid Container with Dotted Border */}
            <div className="relative">
              <div className="border-2 border-dashed border-indigo-300 rounded-3xl p-8 bg-white/30 backdrop-blur-sm">
                {/* Photo Grid */}
                <div className="grid grid-cols-6 gap-4">
                  {headshots.map((headshot, index) => (
                    <div key={headshot.id} className="relative group">
                      <div
                        style={{ boxShadow: "0px 1px 4px 0px #00000040" }}
                        className="aspect-square rounded-2xl border-4 border-[#EDEDED] overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
                      >
                        <img
                          src={headshot.src}
                          alt={headshot.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="flex justify-center mt-6">
                <span className="text-[#653EFF] font-medium italic">100% AI generated</span>
              </div>
            </div>
          </div>

          <div className="min-h-screen bg-[#0C0138] from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-1"
              style={{
                background: "url(/images/photo-studio/home/top-overlay.png)  no-repeat",
                backgroundBlendMode: "overlay",
                flex: 1,
              }}
            ></div>

            <div className="relative z-10 px-8 py-16">
              <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                  <h1 className="text-[16px] md:text-[32px] font-bold text-white mb-6 leading-tight">
                    Stunning AI Photos,
                    <br />
                    On Demand
                  </h1>
                  <p className="text-base text-[#D2D2D2] max-w-2xl mx-auto">
                    From professional Headshots to aspirational Luxuryshots and beyond. – Get
                    incredibly high quality images of yourself
                  </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col">
                      <div className="rounded-xl mb-6" style={{ border: "7px solid #FFFFFF33" }}>
                        <div className="bg-white rounded-xl p-8 h-64 flex items-center justify-center ">
                          <h3 className="text-2xl md:text-3xl font-bold text-purple-600 text-center">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <div className="text-left">
                        <h4 className="text-xl font-bold text-white mb-3">
                          Step {String(step.id).padStart(2, "0")}
                        </h4>
                        <p className="text-purple-200 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Launch App Button */}
                <div className="text-center">
                  <button className="bg-[#000] border border-white  text-white px-6 py-3 rounded-full text-lg font-semibold  shadow-lg">
                    Launch App
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-screen bg-gray-100 pt-16">
          <div className=" mx-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 ">
                {/* Left Text Section */}
                <div className="lg:col-span-1">
                  <h1 className="text-4xl md:text-[32px] font-bold text-gray-900 mb-6 leading-tight">
                    Present your
                    <br />
                    best self
                  </h1>
                  <p className="text-[#626262] text-base leading-relaxed">
                    The extensive range of results enables you to discover the ideal photo for any
                    situation.
                  </p>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-[#653EFF] rounded-3xl p-4">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="aspect-square rounded-2xl overflow-hidden">
                        <img
                          src="/images/photo-studio/home/h1.jpg"
                          alt="Professional headshot 1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="aspect-square rounded-2xl overflow-hidden">
                        <img
                          src="/images/photo-studio/home/h2.jpg"
                          alt="Professional headshot 2"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Headshot</h3>
                    <p className="text-[#D2D2D2] leading-relaxed">
                      Create polished, professional headshots perfect for LinkedIn, company
                      websites, and business profiles. Choose from corporate, urban, or natural
                      settings to match your brand
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-[#FFA0FF] rounded-3xl p-4 ">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="aspect-square rounded-2xl overflow-hidden">
                        <img
                          src="https://assets.artistfirst.in/uploads/1747722518107-Urban_Sleek_Headshot_A1.jpg"
                          alt="Luxury shot 1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="aspect-square rounded-2xl overflow-hidden">
                        <img
                          src="https://assets.artistfirst.in/uploads/1747730359361-Green_Corridor_Headshot_A1.jpg"
                          alt="Luxury shot 2"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Luxuryshot</h3>
                    <p className="text-pink-800 leading-relaxed">
                      Elevate your image with aspirational luxury shots. Ideal for branding, social
                      media campaigns, or visualizing success in high-end environments and exclusive
                      settings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center bg-[#E8E4FF] my-16 p-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 mt-5">Perfect for</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex flex-col items-center group cursor-pointer">
                    <div className="flex">
                      <img src={useCase.icon} />
                      <span className=" pl-2 text-[#653EFF] font-semibold text-base ">
                        {useCase.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isPopupVisible.login && (
          <LoginAndSignup
            callBackName={"uniqueCommunity"}
            open={isPopupVisible.login}
            handleModalClose={handleLoginPopupClose}
          />
        )}
      </Box>
    </div>
  );
};

export default Index;
