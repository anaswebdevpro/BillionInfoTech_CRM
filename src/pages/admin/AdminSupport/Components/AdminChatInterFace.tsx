import React from "react";

interface adminChatInterfaceProp {
  messages: any[];
}

const AdminChatInterFace: React.FC<adminChatInterfaceProp> = ({ messages }) => {
  return (
    <>
      {console.log("Messages in AdminChatInterFace:", messages)}
      <div className=" bg-green-300 max-w-210">AdminChatInterFace</div>
    </>
  );
};

export default AdminChatInterFace;
