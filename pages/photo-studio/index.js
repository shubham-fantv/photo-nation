import axios from "axios";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import SweetAlert2 from "react-sweetalert2";
import Loading from "../../src/component/common/Loading/loading";
import LoginAndSignup from "../../src/component/feature/Login/index";
import { API_BASE_URL, FANTV_API_URL } from "../../src/constant/constants";
import fetcher from "../../src/dataProvider";
import useGTM from "../../src/hooks/useGTM";
import { quotes } from "../../src/utils/common";
const index = (data) => {
  console.log("🚀 ~ index ~ data:", data);
  const [avatarData, setAvatarData] = useState([]);
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const { isLoggedIn, userData } = useSelector((state) => state.user);
  const [image, setImage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [myAvatar, setMyAvatar] = useState(data);
  const { sendEvent } = useGTM();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [subTitle, setSubTitle] = useState("");
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const [swalProps, setSwalProps] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);
  const [isPromptPhotoModalVisible, setIsPromptPhotoModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const MAX_IMAGES = 12;
  const MAX_SIZE_MB = 5;
  //  console.log("data",data);
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (!files.length) return;
    // Combine with existing and check total
    const totalFiles = imagePreviews.length + files.length;
    if (totalFiles > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          alert(`"${file.name}" exceeds 2MB limit and was skipped.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("https://upload.artistfirst.in/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const uploadedUrl = response?.data?.data?.[0]?.url;

        if (uploadedUrl) {
          setImagePreviews((prev) => [
            ...prev,
            {
              file,
              url: uploadedUrl,
              localPreview: URL.createObjectURL(file), // for display until uploaded image loads
            },
          ]);
          setFiles((prev) => [...prev, uploadedUrl]); // ✅ Store uploaded URLs separately
        }
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (url) => {
    setImagePreviews((prev) => prev.filter((img) => img.url !== url));
    setFiles((prev) => prev.filter((f) => f !== url)); // ✅ Also remove from files
  };

  const handleImageChange = (e) => {
    handleImageUpload(e);
  };

  useEffect(() => {
    const pickRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSubTitle(quotes[randomIndex]);
    };
    pickRandomQuote();
    const interval = setInterval(pickRandomQuote, 5000);

    return () => clearInterval(interval);
  }, []);

  const [form, setForm] = useState({
    name: "Gabriela",
    age: "22",
    gender: "female",
    ethnicity: "Caucasian",
    hairColor: "Blonde",
    eyeColor: "Brown",
    clothing: "Dress",
    expression: "Smiling",
    style: "Cinematic portrait",
    orientation: "portrait",
    pose: "upper body",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useQuery(
    `${FANTV_API_URL}/api/v1/ai-avatar`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/ai-avatar?limit=50`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setAvatarData(data);
      },
    }
  );

  useEffect(() => {
    setMyAvatar(data || []);
  }, [data]);

  const { mutate: generateAvatarApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/ai-avatar`, obj),
    {
      onSuccess: (response) => {
        setPrompt("");
        setLoading(false);
        setSwalProps({
          icon: "success",
          show: true,
          title: "Success",
          text: "Avatar generation is completed",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          allowOutsideClick: false, // Optional: prevent dismiss by clicking outside
          allowEscapeKey: false, // Optional: prevent ESC close
        });
      },
      onError: (error) => {
        setLoading(false);

        const defaultMessage = "Something went wrong. Please try again later.";

        const message = error?.response?.data?.message || error?.message || defaultMessage;

        setSwalProps({
          icon: "error",
          show: true,
          title: "Error",
          text: message,
          confirmButtonText: "OK",
        });
      },
    }
  );

  const handleConfirm = () => {
    router.push("/avatar-studio");
  };

  const handleGenerateAvatar = (prompt, name, gender) => {
    if (isLoggedIn) {
      if (!prompt) {
        alert("Please enter a prompt!");
        return;
      }

      if (userData.credits <= 0) {
        router.push("/subscription");
        return;
      }

      const requestBody = {
        prompt,
        name: name,
        gender: gender,
        creditsUsed: 1,
        aspectRatio: "1:1",
        ...(image && { imageUrl: encodeURI(image) }), // ✅ encode URL with spaces
      };
      setLoading(true);

      sendEvent({
        event: "Generate Avatar",
        email: userData?.email,
        name: userData?.name,
        prompt: prompt,
        aspectRatio: "1:1",
      });

      generateAvatarApi(requestBody);
    } else {
      setIsPopupVisible(true);
    }
  };

  const { mutate: generatePhotoAvatarApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/ai-avatar/photo-avatar`, obj),
    {
      onSuccess: (response) => {
        setPrompt("");
        setLoading(false);
        setSwalProps({
          icon: "success",
          show: true,
          title: "Success",
          text: "Photo Avatar generation is completed",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          allowOutsideClick: false, // Optional: prevent dismiss by clicking outside
          allowEscapeKey: false, // Optional: prevent ESC close
        });
      },
      onError: (error) => {
        setLoading(false);

        const defaultMessage = "Something went wrong. Please try again later.";

        const message = error?.response?.data?.message || error?.message || defaultMessage;

        setSwalProps({
          icon: "error",
          show: true,
          title: "Error",
          text: message,
          confirmButtonText: "OK",
        });
      },
    }
  );

  const handleGeneratePhotoAvatar = () => {
    if (isLoggedIn) {
      let nameInput = name;

      if (!nameInput.trim()) {
        nameInput = typeof window !== "undefined" ? window.prompt("Enter avatar name:") : null;
        if (!nameInput || !nameInput.trim()) {
          alert("Upload cancelled. Name is required.");
          return;
        }
      }

      if (userData.credits <= 0) {
        router.push("/subscription");
        return;
      }

      const requestBody = {
        prompt: "Give a upper body image of the person",
        name: nameInput,
        gender: "female",
        creditsUsed: 10,
        aspectRatio: "1:1",
        ...(image && { imageUrl: image }), // ✅ only include if `image` is truthy
        imageInput: files ? files : [],
      };
      setLoading(true);

      sendEvent({
        event: "Generate Photo Avatar",
        email: userData?.email,
        name: userData?.name,
        prompt: prompt,
        aspectRatio: "1:1",
      });

      generatePhotoAvatarApi(requestBody);
    } else {
      setIsPopupVisible(true);
    }
  };
  const handleRedirect = (item) => {
    if (item?.type == "headshot") {
      router.push(`/photo-studio/headshot/${item?._id}`);
    } else {
      router.push(`/photo-studio/luxuryshot/${item?._id}`);
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 min-h-screen">
      {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}

      <div className="justify-center m-auto max-w-6xl">
        <h1 className="text-black text-2xl sm:text-3xl lg:text-[32px] font-semibold text-center leading-tight sm:leading-[38px] px-4">
          Your AI-Powered Photography Studio
        </h1>
        <p className="text-[#1E1E1EB2] text-sm sm:text-base lg:text-[16px] mt-2 font-semibold text-center px-4 max-w-4xl mx-auto">
          From LinkedIn ready headshots to high fashion editorials create pro visuals in seconds
        </p>
      </div>

      <div className="mt-8 sm:mt-10 lg:mt-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {/* Luxuryshot Studio Card */}
          <div
            onClick={() => handleNavigation("/photo-studio/luxuryshot")}
            className="flex flex-col justify-between items-start p-4 sm:p-6 bg-[#F0F9FF] border border-[#7DD3FC] rounded-xl hover:bg-[#E0F2FE] transition cursor-pointer"
          >
            {/* Images Section */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8 relative w-full">
              <img
                src="https://assets.artistfirst.in/uploads/1747489542488-Ai_Avatar_Icon_1.png"
                className="w-full sm:w-[150px] lg:w-[200px] h-[150px] sm:h-[150px] lg:h-[200px] rounded-md object-cover mx-auto sm:mx-0"
              />
              <img
                src="https://assets.artistfirst.in/uploads/1747489568650-AI_Avatar_Icon_2.jpg"
                className="hidden md:block w-full sm:w-[150px] lg:w-[200px] h-[150px] sm:h-[150px] lg:h-[200px] rounded-md object-cover mx-auto sm:mx-0"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6 w-full">
              <button className="text-left">
                <div className="flex items-center gap-2 text-[#0EA5E9]">
                  <span className="font-semibold text-lg sm:text-xl text-[#0369A1]">
                    Luxuryshot Photo Studio
                  </span>
                </div>
              </button>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Immerse yourself in breathtaking visuals with Luxuryshot Photo Studio. Simply choose
                from our curated collection of stunning luxury styles, and our advanced AI will
                instantly transform your photos into bespoke, high-fashion scenes
              </p>
            </div>

            <button className="bg-[#C2D8E7] px-4 sm:px-5 py-2 sm:py-3 rounded-full mt-4 font-semibold text-sm sm:text-base w-full sm:w-auto">
              Create Luxuryshot
            </button>
          </div>

          {/* Headshot Studio Card */}
          <div
            onClick={() => handleNavigation("/photo-studio/headshot")}
            className="flex flex-col cursor-pointer justify-between items-start p-4 sm:p-6 bg-[#F5F3FF] border border-[#A78BFA] rounded-xl hover:bg-[#EDE9FE] transition"
          >
            {/* Images Section */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8 w-full">
              <img
                src="https://assets.artistfirst.in/uploads/1747488821569-Custom_Avatar_Icon_1.jpg"
                className="w-full sm:w-[150px] lg:w-[200px] h-[150px] sm:h-[150px] lg:h-[200px] rounded-md object-cover mx-auto sm:mx-0"
              />
              <img
                src="https://assets.artistfirst.in/uploads/1747488851625-Custom_Avatar_Icon_2.jpg"
                className=" hidden md:block w-full sm:w-[150px] lg:w-[200px] h-[150px] sm:h-[150px] lg:h-[200px] rounded-md object-cover mx-auto sm:mx-0"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6 w-full">
              <button className="text-left">
                <div className="flex items-center gap-2 text-[#7C3AED]">
                  <span className="font-semibold text-lg sm:text-xl text-[#4C1D95]">
                    Headshot Photo Studio
                  </span>
                </div>
              </button>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Transform your photos into professional Headshots with Headshot Photo Studio. Use
                your favorite existing images to instantly create a diverse collection of
                high-quality headshots
              </p>
            </div>

            <button className="bg-[#D1CDE7] px-4 sm:px-5 py-2 sm:py-3 rounded-full mt-4 font-semibold text-sm sm:text-base w-full sm:w-auto">
              Create Headshot
            </button>
          </div>
        </div>

        {/* My Avatars Section */}
        {myAvatar?.data?.length > 0 && (
          <div className="flex justify-between items-center mt-6 sm:mt-8 px-2 sm:px-0">
            <div>
              <p className="font-semibold text-xl sm:text-2xl text-[#1E1E1E]">My Avatars</p>
            </div>
          </div>
        )}

        {/* Avatars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-2 sm:p-6">
          {myAvatar?.data?.length > 0 ? (
            myAvatar?.data.map((avatar) => (
              <div
                onClick={() => handleRedirect(avatar)}
                key={avatar._id}
                className="relative rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer"
              >
                {avatar.finalImageUrl !== "" ? (
                  <div className="relative w-full aspect-square">
                    <img
                      src={avatar.finalImageUrl}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-black flex items-center justify-center">
                    <p className="text-white text-sm sm:text-lg font-medium"></p>
                  </div>
                )}

                {/* Processing Overlay */}
                {avatar?.status === "processing" && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-xl">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-white font-medium text-xs sm:text-sm capitalize">
                        {avatar?.status}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-2 space-y-1">
                  <div className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {avatar.name}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-gray-500 text-sm text-center py-8">
              No avatars found.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isPopupVisible && (
        <LoginAndSignup
          callBackName={"uniqueCommunity"}
          open={isPopupVisible}
          handleModalClose={() => setIsPopupVisible(false)}
        />
      )}

      <SweetAlert2 {...swalProps} onConfirm={handleConfirm} />
    </div>
  );
};

export default index;

export async function getServerSideProps(ctx) {
  const cookie = parseCookies(ctx);
  const authToken = cookie["aToken"];

  try {
    const [avatarResult] = await Promise.all([
      fetcher.get(
        `${FANTV_API_URL}/api/v1/ai-avatar/user-avatars?page=1&limit=100`,
        {
          headers: {
            ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
          },
        },
        "default"
      ),
    ]);

    return {
      props: {
        data: avatarResult.success ? avatarResult.data : [],
      },
    };
  } catch (error) {
    console.error("Error fetching data in getServerSideProps:", error);
    return {
      props: {
        data: [],
      },
    };
  }
}
