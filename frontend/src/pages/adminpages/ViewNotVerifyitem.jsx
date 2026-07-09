import React, { useEffect, useState } from "react";
import { message } from "antd";
import axiosInstance from "../../apicalls/axiosInstance";
import { Viewnotreturncomp } from "../../component/admin/Viewnotreturncomp";

export const ViewNotVerifyitem = () => {
  const [data, setData] = useState([]);

  const fetchdata = async () => {
    try {
      const response = await axiosInstance.get(
        "bookings/analysis/get_item_unverify_all"
      );
      if (!response.data.success) {
        message.error(response.data?.message || "Failed to fetch records");
      }
      setData(response.data.unverified);
      message.success(
        response.data?.message 
      );
    } catch (error) {
      message.error("All booking item Verified");
    }
  };

  const handleVerify = async (booking_id) => {
    try {
      const response = await axiosInstance.patch("/bookings/analysis/verify_booking_item", { booking_id });

      if (response.data.success) {
        message.success(response.data.message || "Booking Verified Successfully ✔");
        fetchdata(); // <- refresh list
      } else {
        message.error("Failed to verify booking");
      }
    } catch {
      message.error("Server error while verifying");
    }
  };
const handleonVerifyall =async(values)=>{
    try {
        const response = await axiosInstance.patch("/bookings/analysis/verify_all_booking_item");
        if(response.data.success){
            message.success(response.data.message || " All Booking approved..")
             fetchdata();
        } else{
                 message.error(response.data?.message || " Booking Approved Failed..Try again. ")
        }
       
    } catch (error) {
        message.error("Server error while verifying");
    }
}
  useEffect(() => {
    fetchdata();
  }, []);
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontWeight: "600", marginBottom: 10 }}>
        📦 All Unverify Items
      </h2>

      <Viewnotreturncomp data={data} onVerify={handleVerify}  onVerifyall={handleonVerifyall} />
    </div>
  );
};
