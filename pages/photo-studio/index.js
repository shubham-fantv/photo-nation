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
  return (
    <div className="px-10 min-h-screen">
      {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}
      <div className="justify-center m-auto">
        <h1 className="text-black text-[32px] font-semibold text-center leading-[38px]">
          Photo Studio
        </h1>
      </div>

      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
          <div
            onClick={() => router.push("/photo-studio/luxuryshot")}
            className="flex justify-between items-center p-6 bg-[#F0F9FF] border border-[#7DD3FC] rounded-xl hover:bg-[#E0F2FE] transition cursor-pointer"
          >
            <div className="flex flex-col gap-4 max-w-[60%]">
              <button>
                <div className="flex items-center gap-2 text-[#0EA5E9]">
                  <span className="font-semibold text-xl  text-[#0369A1]">
                    Luxuryshot Photo Studio
                  </span>
                </div>
              </button>
              <p className="text-sm text-gray-700 pr-10">
                Immerse yourself in breathtaking visuals with Luxuryshot Photo Studio. Simply choose
                from our curated collection of stunning luxury styles, and our advanced AI will
                instantly transform your photos into bespoke, high-fashion scenes. Achieve unique,
                cinematic imagery that perfectly captures your desired aesthetic with just a few
                clicks <br /> <br /> Explore dream scenarios, detailed environments, and captivating
                looks without needing to write a single prompt. This studio offers an intuitive way
                to generate aspirational, high-quality content, placing you directly into luxurious
                settings and high-fashion editorials effortlessly
              </p>
            </div>

            {/* Right: Prompt Preview */}
            <div className="flex gap-2 relative">
              <img
                src="https://assets.artistfirst.in/uploads/1747489542488-Ai_Avatar_Icon_1.png"
                className="w-64 h-64 rounded-md object-cover"
              />
              <img
                src="https://assets.artistfirst.in/uploads/1747489568650-AI_Avatar_Icon_2.jpg"
                className="w-64 h-64 rounded-md object-cover"
              />
            </div>
          </div>

          <div
            onClick={() => router.push("/photo-studio/headshot")}
            className=" cursor-pointer flex justify-between items-center p-6 bg-[#F5F3FF] border border-[#A78BFA] rounded-xl hover:bg-[#EDE9FE] transition"
          >
            <div className="flex flex-col gap-4 max-w-[60%] ">
              <button>
                <div className="flex items-center gap-2 text-[#7C3AED]">
                  <span className="font-semibold text-xl text-[#4C1D95]">
                    Headshot Photo Studio
                  </span>
                </div>
              </button>
              <p className="text-sm text-gray-700 pr-10">
                Transform your photos into professional Headshots with Headshot Photo Studio. Use
                your favorite existing images to instantly create a diverse collection of
                high-quality headshots. Select from various professional styles and backdrops to
                achieve the perfect look for any platform
                <br /> <br /> Ideal for maintaining a polished and consistent brand identity, this
                studio saves you valuable time and resources. Instantly generate multiple looks,
                from different attire to various professional settings, ensuring you always have the
                right headshot ready to impress
              </p>
            </div>

            {/* Right: Preview Images */}
            <div className="flex gap-2">
              <img
                src="https://assets.artistfirst.in/uploads/1747488821569-Custom_Avatar_Icon_1.jpg"
                className="w-64 h-64 rounded-md object-cover"
              />
              <img
                src="https://assets.artistfirst.in/uploads/1747488851625-Custom_Avatar_Icon_2.jpg"
                className="w-64 h-64 rounded-md object-cover"
              />
            </div>
          </div>
        </div>
        {myAvatar?.data?.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div>
              <p variant="h5" className="font-semibold text-2xl text-[#1E1E1E]">
                My Avatars
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {myAvatar?.data?.length > 0 ? (
            myAvatar?.data.map((avatar) => (
              <div
                onClick={() => handleRedirect(avatar)}
                key={avatar._id}
                className="relative rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer"
              >
                {avatar.finalImageUrl != "" ? (
                  <div className="relative w-full aspect-square">
                    <img
                      src={avatar.finalImageUrl}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-black flex items-center justify-center">
                    <p className="text-white text-lg font-medium"></p>
                  </div>
                )}

                {/* Optional overlay for status other than 'completed' */}
                {avatar?.status == "processing" && (
                  <div className="absolute h-48 inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-xl">
                    <p className="text-white font-medium text-lg">{avatar?.status}</p>
                  </div>
                )}

                <div className="p-2 space-y-1">
                  <div className="text-base font-semibold text-gray-800">{avatar.name}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No avatars found.</div>
          )}
        </div>
      </div>

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
