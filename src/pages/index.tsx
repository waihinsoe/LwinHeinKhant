import { config } from "@/config/config";
import Fab from "@mui/material/Fab";
import React, { useContext, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { Images as ImageType } from "@prisma/client";
import { SearchBox } from "@/components/HomePage/SearchBox";
import { ImageBox } from "@/components/HomePage/ImageBox";
import { UploadDialog } from "@/components/HomePage/UploadDialog";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const accessToken =
    typeof window !== "undefined" && localStorage.getItem("accessToken");
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const fetchAllImage = async () => {
    const response = await fetch(`${config.apiBaseUrl}/images`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const responseJson = await response.json();
      setImages(responseJson);
    } else {
      console.log("failed get image data");
    }
  };

  useEffect(() => {
    fetchAllImage();
  }, [isLoading]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        height: "100dvh",
        mx: "auto",
        position: "relative",
      }}
    >
      <SearchBox setSearchTerm={setSearchTerm} />
      <ImageBox
        fetchAllImage={fetchAllImage}
        images={images}
        searchTerm={searchTerm}
      />

      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <UploadDialog
        isLoading={isLoading}
        open={open}
        setOpen={setOpen}
        setIsLoading={setIsLoading}
      />
    </Box>
  );
}
