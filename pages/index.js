import { Box } from "@mui/material";
import React, { useState } from "react";

import LoginAndSignup from "../src/component/feature/Login";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
import UploadPhotos from "../public/images/lottie/upload-photos.json";
import Generate from "../public/images/lottie/generate-shot.json";
import PickStyle from "../public/images/lottie/pick-any-style.json";
import Download from "../public/images/lottie/download-shot.json";
import useGTM from "../src/hooks/useGTM";

const headshots = [
  {
    id: 1,
    src: "https://assets.artistfirst.in/uploads/1747830337257-Forest_GT_LuxuryShot_A1.jpg",
    alt: "Professional headshot 1",
  },
  {
    id: 2,
    src: "https://assets.artistfirst.in/uploads/1749402452057-Luxury_Football_Match_comp.jpg",
    alt: "Professional headshot 2",
  },
  {
    id: 3,
    src: "https://assets.artistfirst.in/uploads/1749402340738-Luxury_Cave_Dinner_comp.jpg",
    alt: "Professional headshot 3",
  },
  {
    id: 4,
    src: "https://assets.artistfirst.in/uploads/1750091923685-Biz_District_Headshot_A1_comp.jpg",
    alt: "Professional headshot 4",
  },
  {
    id: 5,
    src: "https://assets.artistfirst.in/uploads/1750091924148-Coast_Deck_Headshot_A1_comp.jpg",
    alt: "Professional headshot 5",
  },
  {
    id: 6,
    src: "https://assets.artistfirst.in/uploads/1750091924921-Sunlit_Lane_Headshot_A1_comp.jpg",
    alt: "Professional headshot 6",
  },

  // Bottom row - Mixed
  {
    id: 7,
    src: "https://assets.artistfirst.in/uploads/1747830487670-Red_Carpet_Event_LuxuryShot_A1.jpg",
    alt: "Professional headshot 7",
  },
  {
    id: 8,
    src: "https://assets.artistfirst.in/uploads/1749402690758-Luxury_Taj_Mahal_comp.jpg",
    alt: "Professional headshot 8",
  },
  {
    id: 9,
    src: "https://assets.artistfirst.in/uploads/1747830470625-Monaco_Raceview_LuxuryShot_A1.jpg",
    alt: "Professional headshot 9",
  },
  {
    id: 10,
    src: "https://assets.artistfirst.in/uploads/1750091924392-Corp_Suburb_Headshot_A1_comp.jpg",
    alt: "Professional headshot 10",
  },
  {
    id: 11,
    src: "https://assets.artistfirst.in/uploads/1750091924389-Cruise_Deck_Headshot_A1_comp.jpg",
    alt: "Professional headshot 11",
  },
  {
    id: 12,
    src: "https://assets.artistfirst.in/uploads/1750091923701-Bright_Lane_Headshot_A1_comp.jpg",
    alt: "Professional headshot 12",
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

  const { sendEvent, sendGTM } = useGTM();

  const router = useRouter();
  const handleLoginPopupClose = () => {
    setIsPopupVisible({ login: false });
  };

  // Mock data for steps
  const steps = [
    {
      image: UploadPhotos,
      id: 1,
      title: "UPLOAD PHOTOS",
      description:
        "Upload 10-20 high-quality photos of yourself from different angles and lighting conditions",
    },
    {
      image: PickStyle,
      id: 3,
      title: " PICK ANY CATEGORY",
      description:
        "Select from various professional categories, styles, backgrounds, and settings for your photos",
    },
    {
      image: Generate,
      id: 2,
      title: "GENERATE",
      description:
        "Our advanced AI analyzes your photos and learns your unique features and characteristics",
    },

    {
      image: Download,
      id: 4,
      title: "DOWNLOAD",
      description: "Receive your stunning, professional-quality AI-generated photos in minutes",
    },
  ];

  const handleNavigation = () => {
    sendEvent({
      event: "button_clicked",
      button_text: "Craft Your Perfect Look",
      interaction_type: "Standard Button",
      section_name: "Header",
      navigation_group: "Studios",
      button_id: "hdr_lp_primary_cta_btn",
      page_name: "Landing Page",
    });
    sendGTM({ event: "landingPagePriamryCTAPN" });

    router.push("/photo-studio");
  };
  const handleNavigationLaunch = () => {
    sendEvent({
      event: "button_clicked",
      button_text: "Launch App",
      interaction_type: "Standard Button",
      section_name: "Header",
      navigation_group: "Studios",
      button_id: "section_lp_primary_cta_btn",
      page_name: "Landing Page",
    });
    router.push("/photo-studio");
  };

  return (
    <div>
      <Box className="min-h-screen text-black bg-[#FFF]">
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-8 lg:mb-12">
              <div className="flex items-center justify-center gap-3 mb-4 lg:mb-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-[#1B0064] via-[#1B0064] to-[#4719C5] bg-clip-text text-transparent">
                  PhotoNation
                </h1>
              </div>

              <p className="text-[#626262] text-base sm:text-lg mb-6 lg:mb-8 max-w-md mx-auto px-4">
                Transform your photos into stunning, professional quality AI photos
              </p>

              <button
                style={{
                  background: "linear-gradient(180deg, #FFA0FF 0%, #653EFF 100%)",
                  boxShadow: "0px 0px 17px 0px #FFFFFF8C",
                }}
                className="text-white rounded-full px-1 py-1 text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div
                  onClick={handleNavigation}
                  className="flex items-center px-3 sm:px-4 py-2 rounded-full cursor-pointer"
                  style={{ border: "1px solid #FFF" }}
                >
                  <span className="whitespace-nowrap">Craft Your Perfect Look</span>
                  <span className="ml-2">→</span>
                </div>
              </button>
            </div>

            {/* 100% AI Generated Badge */}
            <div className="flex justify-center sm:justify-end mb-6 lg:mb-8">
              <span className="text-[#653EFF] font-medium italic text-sm sm:text-base">
                100% AI generated
              </span>
            </div>

            {/* Photo Grid Container with Dotted Border */}
            <div className="relative">
              <div className="border-2 border-dashed border-indigo-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 bg-white/30 backdrop-blur-sm">
                {/* Photo Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
                  {headshots.map((headshot, index) => (
                    <div key={headshot.id} className="relative group">
                      <div
                        style={{ boxShadow: "0px 1px 4px 0px #00000040" }}
                        className="aspect-square rounded-lg sm:rounded-xl lg:rounded-2xl border-2 sm:border-4 border-[#EDEDED] overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
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
              <div className="flex justify-center mt-4 lg:mt-6">
                <span className="text-[#653EFF] font-medium italic text-sm sm:text-base">
                  100% AI generated
                </span>
              </div>
            </div>
          </div>

          <div className="min-h-screen bg-[#0C0138] from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-1 hidden sm:block"
              style={{
                background: "url(/images/photo-studio/home/top-overlay.png) no-repeat",
                backgroundBlendMode: "overlay",
                flex: 1,
              }}
            ></div>

            <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 lg:mb-16">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[32px] font-bold text-white mb-4 lg:mb-6 leading-tight px-4">
                    Stunning AI Photos,
                    <br />
                    On Demand
                  </h1>
                  <p className="text-sm sm:text-base text-[#D2D2D2] max-w-2xl mx-auto px-4">
                    From professional Headshots to aspirational Luxuryshots and beyond. – Get
                    incredibly high quality images of yourself
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16 ">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col">
                      <div className="rounded-xl mb-4 lg:mb-6 border-4 sm:border-[7px] border-[#FFFFFF33]">
                        <div className="bg-white rounded-xl h-[160px] sm:h-56 lg:h-64 w-full flex items-center justify-center overflow-hidden">
                          <Lottie
                            animationData={step.image}
                            loop={true}
                            className="w-full h-full max-h-[160px] sm:max-h-full"
                          />
                        </div>
                      </div>

                      <div className="text-left">
                        <h4 className="text-lg sm:text-xl font-bold text-white mb-2 lg:mb-3">
                          {step.title}
                        </h4>
                        <p className="text-purple-200 leading-relaxed text-sm sm:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Launch App Button */}
                <div className="text-center">
                  <button
                    onClick={handleNavigationLaunch}
                    className="bg-[#000] border border-white text-white px-6 py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg"
                  >
                    Start Creating
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-screen bg-gray-100 pt-12 sm:pt-16">
            <div className="mx-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                  {/* Left Text Section */}
                  <div className="lg:col-span-1 text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-[32px] font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                      Present your
                      <br />
                      best self
                    </h1>
                    <p className="text-[#626262] text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                      The extensive range of results enables you to discover the ideal photo for any
                      situation.
                    </p>
                  </div>

                  {/* Headshot Card */}
                  <div className="lg:col-span-1">
                    <div className="bg-[#653EFF] rounded-2xl sm:rounded-3xl p-3 sm:p-4">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden">
                          <img
                            src="https://assets.artistfirst.in/uploads/1750091923716-Green_Corridor_Headshot_A1_comp.jpg"
                            alt="Professional headshot 1"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden">
                          <img
                            src="https://assets.artistfirst.in/uploads/1750091924952-Sunset_Sea_Headshot_A1_comp.jpg"
                            alt="Professional headshot 2"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                        Headshot Photos
                      </h3>
                      <p className="text-[#D2D2D2] leading-relaxed text-sm sm:text-base">
                        Create polished, professional headshots perfect for LinkedIn, company
                        websites, and business profiles. Choose from corporate, urban, or natural
                        settings to match your brand
                      </p>
                    </div>
                  </div>

                  {/* Luxuryshot Card */}
                  <div className="lg:col-span-1">
                    <div className="bg-[#FFA0FF] rounded-2xl sm:rounded-3xl p-3 sm:p-4">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden">
                          <img
                            src="https://assets.artistfirst.in/uploads/1750094991709-Altitude_Cabin_LuxuryShot_A1_comp.jpg"
                            alt="Luxury shot 1"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden">
                          <img
                            src="https://assets.artistfirst.in/uploads/1750094991735-Classic_Car_Rally_LuxuryShot_A1_comp.jpg"
                            alt="Luxury shot 2"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                        Luxury Photos
                      </h3>
                      <p className="text-pink-800 leading-relaxed text-sm sm:text-base">
                        Elevate your image with aspirational luxury shots. Ideal for branding,
                        social media campaigns, or visualizing success in high-end environments and
                        exclusive settings extremely
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perfect For Section */}
              <div className="text-center bg-[#E8E4FF] my-12 sm:my-16 p-6 sm:p-8 lg:p-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 mt-2 sm:mt-5">
                  Perfect for
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-10 max-w-6xl mx-auto px-4">
                  {useCases.map((useCase, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center justify-center group cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 sm:w-6 sm:h-6  rounded-full flex-shrink-0">
                          <img src={useCase.icon} />
                        </div>
                        <span className="ml-2 text-[#653EFF] font-semibold text-sm sm:text-base text-center sm:text-left">
                          {useCase.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
