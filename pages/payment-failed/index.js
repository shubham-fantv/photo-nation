import React, { use, useEffect } from "react";
import useGTM from "../../src/hooks/useGTM";
import { useSelector } from "react-redux";

const Index = () => {
  const { sendGTM } = useGTM();
  const userData = useSelector((state) => state.user);
  useEffect(() => {
    sendGTM({
      event: "paymentFailedPN",
      email: userData?.email,
      name: userData?.name,
    });
  }, []);
  return (
    <div>
      <div>
        <div className="flex pt-10 justify-center align-center text-2xl text-black">
          <div>Payment Failed</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
