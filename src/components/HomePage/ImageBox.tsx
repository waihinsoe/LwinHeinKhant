import { config } from "@/config/config";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Images as ImageType } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ImageViewer from "react-simple-image-viewer";

interface Props {
  images: ImageType[];
  fetchAllImage: () => void;
  searchTerm: String;
}

export const ImageBox = ({ images, fetchAllImage, searchTerm }: Props) => {
  const router = useRouter();
  const theme = useTheme();
  const accessToken =
    typeof window !== "undefined" && localStorage.getItem("accessToken");

  const [currentImage, setCurrentImage] = useState<number>(0);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | undefined>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`${config.apiBaseUrl}/images?imageId=${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "DELETE",
    });
    if (response.ok) {
      fetchAllImage();
    } else {
      console.log("fail to delete image!");
    }
  };

  const handleDownload = (url: string) => {
    const onlyFileName = url && url.split("/")[7];

    console.log(onlyFileName);
    router.push(
      `https://res.cloudinary.com/dnhwkmskb/image/upload/fl_attachment/v1717510661/${onlyFileName}`
    );
  };

  const openImageViewer = (index: number) => {
    console.log("imageIndex : ", index);
    setCurrentImage(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const searchedImages =
    images &&
    images.filter((item) => {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <ImageList
      sx={{ p: 0.5 }}
      cols={isMobile ? 2 : 3}
      variant="masonry"
      gap={8}
    >
      {searchedImages.length > 0 &&
        searchedImages.map((item, index) => {
          return (
            <ImageListItem key={item.url}>
              <img
                srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.url}?w=248&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
                onClick={() => openImageViewer(index)}
              />
              <ImageListItemBar
                title={item.title}
                actionIcon={
                  <Box sx={{ display: "flex" }}>
                    <IconButton
                      sx={{ color: "#fff" }}
                      aria-label={`info about ${item.title}`}
                      onClick={() => {
                        handleDownload(item.url);
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: "#FF6500" }}
                      aria-label={`info about ${item.title}`}
                      onClick={() => {
                        setIdToDelete(item.id);
                        handleClickOpen();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              />
            </ImageListItem>
          );
        })}

      {isViewerOpen && (
        <Box sx={{ zIndex: 20000, position: "relative" }}>
          <ImageViewer
            src={searchedImages.map((item) => item.url)}
            currentIndex={currentImage}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
          />
        </Box>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "red" }}>
          Are you sure?
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>NO</Button>
          <Button
            onClick={() => {
              if (!idToDelete) return;
              handleDelete(idToDelete);
              handleClose();
            }}
            autoFocus
            sx={{ color: "red" }}
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </ImageList>
  );
};
