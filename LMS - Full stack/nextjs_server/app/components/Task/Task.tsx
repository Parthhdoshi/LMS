'use client';
import React, { useState } from "react";
import axios from "axios";

// Define types for the props
interface TaskComponentProps {
  taskData: any;
  handleTaskSubmit?:(fileName:string, fileType:string, fileBase64:string) => void 
}

const Task: React.FC<TaskComponentProps> = ({ taskData, handleTaskSubmit }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result.split(",")[1];

      //@ts-ignore
      const fileName = file?.name;
      //@ts-ignore
      const fileType = file?.type;

      const payload = {
        fileName,
        fileType,
        fileBase64: base64data,
      };

      setUploading(true);
      try {

        if (handleTaskSubmit) {
            handleTaskSubmit(fileName, fileType, base64data)
          }

        setMessage("File uploaded successfully");
        setFile(null)

      } catch (error) {
        setMessage("File upload failed");
      } finally {
        setUploading(false);
      }
    };
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-100 p-4 rounded-md shadow-md">

          {taskData.map((task: any) => {
            return <h2 key={task._id}  className="text-xl font-semibold mb-4">
              {task.title}
            </h2>;
          })}

          <input
            type="file"
            onChange={handleFileChange}
            aria-label="Upload Task files"
          />
          <div>

          <button onClick={handleFileUpload} disabled={uploading} className="px-4 py-2 my-3 bg-blue-500 text-white rounded-md">
            {uploading ? "Uploading..." : "Upload"}
          </button>
          {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
