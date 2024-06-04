import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import React, { useContext, useState } from "react";
import FileDropZone from "../FileDropZone";
import TextField from "@mui/material/TextField";
import { Images as ImageType } from "@prisma/client";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import Chip from "@mui/material/Chip";
import { AppContext } from "@/context/AppContext";
import { config } from "@/config/config";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  setOpen: (value: any) => void;
  setIsLoading: (value: any) => void;
  isLoading: boolean;
}

export const UploadDialog = ({
  open,
  setOpen,
  setIsLoading,
  isLoading,
}: Props) => {
  const { accountOwner } = useContext(AppContext);
  const accessToken =
    typeof window !== "undefined" && localStorage.getItem("accessToken");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageInfo, setImageInfo] = useState<Partial<ImageType>>({
    title: "",
    url: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpload = async () => {
    console.log(accessToken);
    if (!imageInfo.title || !selectedFile)
      return alert("Please fill all input!");

    if (!accountOwner) return;
    setIsLoading(true);
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("files", selectedFile as Blob);
        const response = await fetch(`${config.apiBaseUrl}/assets`, {
          method: "POST",
          body: formData,
        });
        const responseJson = await response.json();
        const assetUrl = responseJson.assetUrl;
        imageInfo.url = assetUrl;
      }
      imageInfo.userId = accountOwner.id;

      const response = await fetch(`${config.apiBaseUrl}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(imageInfo),
      });

      if (response.ok) {
        setImageInfo({ title: "", url: "" });
        setSelectedFile(undefined);
        setIsLoading(false);
        setOpen(false);
      } else {
        setIsLoading(false);
        alert("Failed upload");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFileSelected = (files: File[]) => {
    setSelectedFile(files[0]);
  };

  const isDisable = !imageInfo.title || !selectedFile;
  return (
    <Dialog
      open={open}
      // onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      TransitionComponent={Transition}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>UPLOAD IMAGE </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            margin="dense"
            variant="outlined"
            defaultValue={imageInfo.title}
            onChange={(evt) =>
              setImageInfo({ ...imageInfo, title: evt.target.value })
            }
          />
          <Box>
            <FileDropZone onFileSelected={onFileSelected} />
            {selectedFile && (
              <Chip
                sx={{ mt: 1 }}
                label={selectedFile.name}
                onDelete={() => setSelectedFile(undefined)}
              />
            )}
          </Box>
          <LoadingButton
            loading={isLoading}
            onClick={handleUpload}
            disabled={isDisable}
            variant="contained"
            sx={{
              width: "fit-content",
              mt: 2,
              alignSelf: "end",
            }}
          >
            Upload
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
