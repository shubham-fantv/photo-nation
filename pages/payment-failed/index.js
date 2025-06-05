import React, { useEffect } from "react";
import useGTM from "../../src/hooks/useGTM";

const Index = () => {
  const { sendGTM } = useGTM();
  useEffect(() => {
    sendGTM({ event: "paymentFailedPN" });
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
