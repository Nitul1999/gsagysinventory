import React, { useEffect, useState } from "react";
import { message } from "antd";
import axiosInstance from "../../apicalls/axiosInstance";
import { Viewnotreturncomp } from "../../component/admin/Viewnotreturncomp";

export const ViewAllNotReturnItems = () => {
  const [data, setData] = useState([]);

  // Fetch records of not returned items
  const fetchNotReturned = async () => {
    try {
      const res = await axiosInstance.get("/bookings/analysis/get_item_pending_return/user"); // Update API if different
      setData(res.data.pending);
    } catch (error) {
      message.error("Failed to fetch records");
    }
  };

  useEffect(() => {
    fetchNotReturned();
  }, []);

 

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontWeight: "600", marginBottom: 10 }}>
        📦 All Not Returned Items
      </h2>

    
      <Viewnotreturncomp data={data} />
    </div>
  );
};
