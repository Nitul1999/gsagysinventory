import React, { useEffect, useState } from "react";
import { message } from "antd";
import axiosInstance from "../../apicalls/axiosInstance";
import { Viewnotreturncomp } from "../../component/admin/Viewnotreturncomp";

export const ViewAllreturneditem = () => {
  const [data, setData] = useState([]);

  // Fetch records of not returned items
  const fetchAllReturned = async () => {
    try {
      const response = await axiosInstance.get(
        "/bookings/analysis/get_booking_item_returned"
      ); // Update API if different

      if (!response.data.success) {
        message.error(response.data?.message || "Failed to fetch records");
      }
      setData(response.data.returned);
      message.success(response.data?.message);
    } catch (error) {
      message.error("Failed to fetch records");
    }
  };

  useEffect(() => {
    fetchAllReturned();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontWeight: "600", marginBottom: 10 }}>
        📦 All Returned Items
      </h2>

      <Viewnotreturncomp data={data} />
    </div>
  );
};
