import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import { useRef, useEffect } from "react";
import { useRouter } from "next/router";
interface Props {
  setSearchTerm: (value: any) => void;
}

export const SearchBox = ({ setSearchTerm }: Props) => {
  const router = useRouter();
  const inputElement = useRef(null);

  useEffect(() => {
    //@ts-ignore
    inputElement.current.onfocus = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    };
  });

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        mb: 1,
        mx: 1,
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 5,
        zIndex: 1000,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search photo...."
        inputProps={{ "aria-label": "Search photo...." }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        ref={inputElement}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 1 }} orientation="vertical" />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={() => {
          localStorage.removeItem("accessToken");
          router.push("/signIn");
        }}
      >
        <LogoutIcon />
      </IconButton>
    </Paper>
  );
};
