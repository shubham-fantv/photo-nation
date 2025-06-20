import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import SweetAlert2 from "react-sweetalert2";
import Loading from "../../../src/component/common/Loading/loading";
import { API_BASE_URL, FANTV_API_URL } from "../../../src/constant/constants";
import fetcher from "../../../src/dataProvider";
import { quotes } from "../../../src/utils/common";
import { useQuery } from "react-query";
import { useRef } from "react";
import AIAvatarSteps from "../../../src/component/HeadShot/AIAvatarSteps";
import BadPhotos from "../../../src/component/HeadShot/BadPhotos";
import GoodPhotos from "../../../src/component/HeadShot/GoodPhotos";
import  useGTM  from "../../../src/hooks/useGTM";

const Index = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const [swalProps, setSwalProps] = useState({});
  const { isLoggedIn, userData } = useSelector((state) => state.user);
  const [subTitle, setSubTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [totalFileSelected, setTotalFileSelected] = useState(0);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const [headShotStyleData, setHeadShotStyleData] = useState([]);
  const { sendEvent} = useGTM();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [groupedData, setGroupedData] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([]);

  const MAX_IMAGES = 12;
  const MAX_SIZE_MB = 5;

  const { mutate: generateImageApi } = useMutation(
    (obj) => fetcher.post(`${FANTV_API_URL}/api/v1/ai-image`, obj),
    {
      onSuccess: (response) => {
        setLoading(false);
        // router.replace(`/generate-image/${response?.data._id}`, undefined, { scroll: false });
        router.push(`/image/headshot/${response?.data._id}`, undefined, {
          scroll: false,
        });
      },
      onError: (error) => {
        setLoading(false);
        const defaultMessage = "Something went wrong. Please try again later.";
        const message =
          error?.response?.data?.message || error?.message || defaultMessage;
        setSwalProps({
          key: Date.now(),
          icon: "error",
          show: true,
          title: "Error",
          text: message,
          confirmButtonText: "OK",
        });
      },
    }
  );

  useEffect(() => {
    const pickRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSubTitle(quotes[randomIndex]);
    };
    pickRandomQuote();
    const interval = setInterval(pickRandomQuote, 5000);
    return () => clearInterval(interval);
  }, []);

  const { isLoading: loadingHeadShot } = useQuery(
    `${FANTV_API_URL}/api/v1/homefeed`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/headshot/headshot`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setHeadShotStyleData(
          data.filter((item) => item.category !== "Natural")
        );
      },
    }
  );

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (!files.length) return;
    const totalFiles = imagePreviews.length + files.length;
    setTotalFileSelected(totalFiles);
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

        const response = await axios.post(
          "https://upload.artistfirst.in/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

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

  const { mutate: generatePhotoAvatarApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/ai-avatar/photo-avatar`, obj),
    {
      onSuccess: (response) => {
        setLoading(false);
        router.push(`/image/headshot/${response?.data._id}`, undefined, {
          scroll: false,
        });
      },
      onError: (error) => {
        setLoading(false);
        const defaultMessage = "Something went wrong. Please try again later.";
        const message =
          error?.response?.data?.message || error?.message || defaultMessage;
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
    if (imagePreviews.length > 0) {
      if (isLoggedIn) {
        setLoading(true);
        let nameInput = name;

        if (!nameInput.trim()) {
          nameInput =
            typeof window !== "undefined"
              ? window.prompt("Enter avatar name:")
              : null;
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
          headshots: selectedImages.map((item) => item._id),
          imageInput: files ? files : [],
        };
        setLoading(true);
        generatePhotoAvatarApi(requestBody);
      } else {
        alert("please login");
      }
    } else {
      alert("Upload your photos to explore styles and generate your Headshots");
    }
  };

  useEffect(() => {
    if (headShotStyleData.length > 0) {
      const grouped = headShotStyleData.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});

      setGroupedData(grouped);
      const categories = Object.keys(grouped);
      setCategoryOrder(categories);

      // Set first category as default selected
      if (!selectedCategory && categories.length > 0) {
        setSelectedCategory(categories[0]);
      }
    }
  }, [headShotStyleData, selectedCategory]);

  const getMainImages = () => {
    return categoryOrder.map((category) => ({
      category,
      ...groupedData[category][0],
    }));
  };

  const getRelatedImages = () => {
    if (!selectedCategory || !groupedData[selectedCategory]) {
      return [];
    }
    return groupedData[selectedCategory];
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const toggleImageSelection = (imageObj) => {
    setSelectedImages((prev) => {
      const isSelected = prev.some((img) => img._id === imageObj._id);

      if (isSelected) {
        return prev.filter((img) => img._id !== imageObj._id);
      } else {
        return [...prev, imageObj];
      }
    });
  };

  const isImageSelected = (imageObj) => {
    return selectedImages.some((img) => img._id === imageObj._id);
  };

  const mainImages = getMainImages();
  const relatedImages = getRelatedImages();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const selectedCount = imagePreviews.length;
    const progress = (selectedCount / MAX_IMAGES) * 100;
    setProgress(progress);
  }, [imagePreviews.length, MAX_IMAGES]);

  useEffect(() => {
      sendEvent({
        event: "page_view",
        page_name: "Headshot Page",
        page_url: window.location.href,
        app_id: "Photonation",
      });
    }, []);

  return (
    <div className="flex flex-col md:flex-row text-black md:gap-4">
      {(isLoading || loadingHeadShot) && (
        <Loading title={"Please wait"} subTitle={subTitle} />
      )}
      <div className="w-full md:w-[30%] bg-[#FFFFFF0D] p-4 border-2 ml-8  rounded-xl">
        <div>
          <div>
            <div className=" text-center cursor-pointer transition mb-2">
              <div className="flex flex-col items-center">
                <div className=" w-full mx-auto py-2">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="font-semibold text-[#1E1E1E]">
                      Select upto {MAX_IMAGES} photos
                    </h1>
                    <span className="font-medium text-gray-600">
                      {imagePreviews.length}/{MAX_IMAGES}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full cursor-pointer">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {imagePreviews?.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
                    {imagePreviews.map(({ url, localPreview }, idx) => (
                      <div key={idx} className="relative  mt-3">
                        <img
                          src={localPreview || url}
                          className="w-full h-16 object-cover rounded-md "
                          alt="preview"
                        />
                        <button
                          onClick={() => handleRemoveImage(url)}
                          className="absolute top-[-8px] right-[-8px] bg-[#EBEBEB] text-black rounded-full w-5 h-5   flex items-center justify-center"
                        >
                          <img
                            className="h-2"
                            src="/images/headshot/close.png"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleImageChange}
                  disabled={uploading}
                />
                <div className="bg-[#F5F5F5] p-6 rounded-xl w-full">
                  <div className="flex m-auto justify-center">
                    <img src="/images/headshot/gallery-add.svg" />
                  </div>
                  <p className="text-sm text-[#1E1E1E]">
                    Select upto 12 photos to upload
                  </p>
                  <p className="text-xs text-[#626262] mb-2 mt-4">
                    Upload PNG, JPG, HEIC, or WebP file up to 5MB each
                  </p>

                  <button
                    onClick={() => {
                      if (imagePreviews.length >= MAX_IMAGES) {
                        alert("Maximum 12 images allowed.");
                        return;
                      }
                      inputRef.current.click();
                    }}
                    disabled={uploading}
                    className="mt-3 text-[#1E1E1E] px-4 py-2 rounded-full border border-[#1E1E1E] text-base "
                  >
                    {uploading ? "Uploading..." : "Browse"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-xl mx-auto pt-3">
            <h2 className="text-sm font-medium mb-3">Select Headshot Style</h2>

            {/* Category Selection Row */}
            <div className="flex gap-1 overflow-x-auto mb-4">
              {mainImages.map((img, idx) => (
                <div
                  key={img._id}
                  className={`flex flex-col items-center cursor-pointer border-2 rounded-xl ${
                    selectedCategory === img.category
                      ? "border-purple-500"
                      : "border-transparent"
                  }`}
                  onClick={() => handleCategorySelect(img.category)}
                >
                  <img
                    src={img.url}
                    alt={`${img.category} style`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <span className="text-xs text-[#626262] mt-1">
                    {img.category}
                  </span>
                </div>
              ))}
            </div>
            {/* Selected Category Images Grid */}
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl mb-6">
              {relatedImages.map((img, idx) => (
                <div key={img._id} onClick={() => toggleImageSelection(img)}>
                  <div
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden transition relative ${
                      isImageSelected(img)
                        ? "border-purple-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${img.style} - ${img.description}`}
                      className="w-full h-20 object-cover"
                    />
                    {isImageSelected(img) && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-2 h-2 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-xs flex text-center text-[#626262] mt-">
                    {img.style}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <h3 className="mb-6 text-sm text-[#1E1E1EB2] text-normal">
            Credits : 1
          </h3>

          {Math.floor(userData?.credits) < 6 && (
            <div className="text-center">
              <small
                className={
                  Math.floor(userData.credits) < 2
                    ? "text-red-600 font-semibold"
                    : "text-black"
                }
              >
                {Math.max(1, Math.floor(userData.credits))} image
                {Math.floor(userData.credits) === 1 ? "" : "s"} left
              </small>
            </div>
          )}

          <div className="flex w-full items-center justify-center gap-4 mt-2 mb-6">
            <button
              disabled={
                imagePreviews?.length == 0 || selectedImages?.length == 0
              }
              onClick={handleGeneratePhotoAvatar}
              className="flex w-full items-center text-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all text-sm md:text-base 
             disabled:bg-gray-400 disabled:cursor-not-allowed disabled:from-gray-200 disabled:to-gray-400"
            >
              ✨ Generate
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col pr-8 pl-4 items-center ">
        <h2 className="text-2xl font-semibold">Create an Avatar</h2>
        <h3 className="pt-2 font-semibold text-[#1E1E1EB2]">
          Upload photos to create multiple looks for your avatar
        </h3>
        <div></div>
        <AIAvatarSteps />
        <GoodPhotos />
        <BadPhotos />
      </div>
      <SweetAlert2
        {...swalProps}
        onConfirm={(handleConfirm) => setSwalProps({ show: false })}
      />
    </div>
  );
};

export default Index;

export async function getServerSideProps(ctx) {
  return {
    props: {
      withSideBar: false,
    },
  };
}
