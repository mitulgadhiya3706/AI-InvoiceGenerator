import React from "react";
 
function StatusBadge(props) {
  const status = props.status;
 
  //Default colors (if status doesn't match anything below)
  let textColor = "text-[#5A5848]";
  let bgColor = "bg-[#EFECE3]";
  let borderColor = "#D8D4C8";
  let label = "Draft";
 

  if (status === "paid") {
    textColor = "text-[#2A5A38]";
    bgColor = "bg-[#D4EAD8]";
    borderColor = "#A8D0B0";
    label = "Paid";
  } else if (status === "pending") {
    textColor = "text-[#7A4A10]";
    bgColor = "bg-[#F5EDDA]";
    borderColor = "#D4B880";
    label = "Pending";
  } else if (status === "overdue") {
    textColor = "text-[#7A2020]";
    bgColor = "bg-[#F5E4E4]";
    borderColor = "#D4A0A0";
    label = "Overdue";
  } else if (status === "cancelled") {
    textColor = "text-[#5A5848]";
    bgColor = "bg-[#EFECE3]";
    borderColor = "#D8D4C8";
    label = "Cancelled";
  }
 
  return (
    <span
      className={textColor + " " + bgColor + " text-[9px] font-medium uppercase px-2 py-0.5 rounded"}
      style={{ border: "1px solid " + borderColor }}
    >
      {label}
    </span>
  );
}
 
export default StatusBadge;