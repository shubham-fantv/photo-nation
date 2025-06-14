import { Box, Modal } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { API_BASE_URL } from "../../../constant/constants";
import fetcher from "../../../dataProvider";
import { setToken, setUserData } from "../../../redux/slices/user";
import loginData from "../../../utils/login";
import { styles } from "./style";
import useGTM from "../../../hooks/useGTM";

const LoginAndSignup = ({ open, handleModalClose }) => {
  const dispatch = useDispatch();
  const { sendEvent, sendGTM } = useGTM();
  const { mutate: loginGoogleApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/auth/login-google`, obj),
    {
      onSuccess: (res) => {
        loginData(
          res.data.token,
          res.data.user.name,
          res.data.user.email,
          res.data.user.id
        );
        dispatch(setUserData(res?.data?.user));
        dispatch(
          setToken({
            accessToken: res.data.token,
            refreshToken: res.data.token,
            isLoggedIn: true,
          })
        );
        sendEvent({
          event: "signup_successful",
          email: res?.data?.user?.email,
          name: res?.data?.user?.name,
          signup_method: "Google",
        });
        sendGTM({ event: "signupSuccessfulPN" });
        handleModalClose();
      },
      onError: (error) => {
        alert(error.response.data.message);
      },
    }
  );

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const access_token = tokenResponse.access_token;
      loginGoogleApi({ access_token });
    },
    onError: (error) => console.log("Login Failed:", error),
    scope: "openid email profile",
    flow: "implicit",
  });

  const handleLoginClick = () => {
    sendEvent({
      event: "signup_initiated",
      signup_method: "Google",
    });
    login();
  };
  return (
    <>
      <Modal
        style={{ zIndex: "9999", backdropFilter: "blur(44px)", blur: "40px" }}
        open={open}
        onClose={handleModalClose}
        closeAfterTransition
      >
        <Box
          sx={{
            ...styles.wrapper,
            background: "white",
            borderRadius: "20px",
            padding: "32px",
            position: "relative",
            maxWidth: "400px",
            margin: "auto",
            overflow: "hidden",
          }}
        >
          {/* Close Button */}
          <Box
            sx={{
              cursor: "pointer",
              background: "#fff",
              borderRadius: "100px",
              position: "absolute",
              right: "5px",
              top: "5px",
              height: "32px",
              width: "32px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
            onClick={handleModalClose}
          >
            <img src="/images/close.svg" alt="Close" className="h-4 w-4" />
          </Box>

          {/* Top Before/After */}
          <div className="flex justify-center items-center mb-8 space-x-8">
            <div className="text-center">
              <img
                src="/images/before1.svg"
                alt="Before 1"
                className="transform -rotate-6 w-64 h-93 object-cover"
              />
            </div>

            <img src="/images/arrow.svg" alt="Arrow" className="w-12 h-12" />

            <div className="text-center">
              <img
                src="/images/after1.svg"
                alt="After 1"
                className="transform -rotate-[10deg] w-64 h-93 object-cover"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="justify-center flex mb-4">
            <img
              src={"/images/logo-white.svg"}
              alt="VideoNation Logo"
              width={140}
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Heading */}
          <p className="text-black text-center text-2xl font-semibold mb-6">
            Welcome to PhotoNation
          </p>

          {/* Google Login */}
          <button
            style={{
              background: "#f1f1f1",
              borderRadius: "999px",
              padding: "12px 20px",
              width: "100%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            onClick={() => handleLoginClick()}
          >
            <div className="flex items-center justify-center text-black font-medium">
              <span className="h-6 w-6 mr-3">
                <img
                  className="h-6 w-6"
                  src="/images/icons/google.svg"
                  alt="Google"
                />
              </span>
              <span>Sign in with Google</span>
            </div>
          </button>

          {/* Terms */}
          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">
              By signing up, you agree to our{" "}
              <a href="/terms" target="_blank" className="text-[#FFA0FF]">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="text-[#FFA0FF]">
                Privacy Policy
              </a>
            </span>
          </div>

          {/* Bottom Before/After */}
          <div className="flex justify-center items-center mt-8 space-x-8">
            <div className="text-center">
              <img
                src="/images/before2.svg"
                alt="Before 2"
                className="transform -rotate-6 w-64 h-93 object-cover"
              />
            </div>

            <img src="/images/arrow2.svg" alt="Arrow" className="w-12 h-12" />
            <div className="text-center">
              <img
                src="/images/after2.svg"
                alt="After 2"
                className="transform rotate-6 w-64 h-93 object-cover"
              />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default LoginAndSignup;
