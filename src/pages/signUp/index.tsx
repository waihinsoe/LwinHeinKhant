import { FormEvent, useContext, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { config } from "@/config/config";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Copyright, Visibility, VisibilityOff } from "@mui/icons-material";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setAppData, ...contextData } = useContext(AppContext);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = userInfo.email && userInfo.password && userInfo.name;
    if (!isValid) return alert("need Info!");
    const response = await fetch(`${config.apiBaseUrl}/auth/signUp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });

    if (response.ok) {
      const responseJson = await response.json();
      const accessToken = responseJson.accessToken;
      if (accessToken) {
        setAppData({ ...contextData, accessToken });
        localStorage.setItem("accessToken", accessToken);
        return router.push("/");
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label="name"
                autoFocus
                onChange={(e) => {
                  setUserInfo({ ...userInfo, name: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, email: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password *
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, password: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signIn" className="underline text-blue-500">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};

export default SignUp;

// <div
// className={`grid h-screen place-items-center ${defaultStyles.theme} bg-no-repeat bg-center bg-cover`}
// // style={{ backgroundImage: `url('${PageBg}')` }}
// >
// <form
//   className="flex flex-col items-center w-full gap-5 p-4 md:w-96"
//   onSubmit={handleSubmit}
// >
//   <div className="flex flex-col items-center">
//     <div className="grid w-12 h-12 text-xl rounded-full bg-light-accent1 place-items-center text-light-secondaryText">
//       <PiLockKeyBold />
//     </div>
//     <span className="text-xl">Sign up</span>
//   </div>

//   <div className="flex items-center w-full gap-2 px-3 border-[1px] rounded-sm border-light-accent1 backdrop-blur-sm">
//     <div className="text-xl text-light-accent1">
//       <SiNamecheap />
//     </div>
//     <input
//       required
//       type="text"
//       name="name"
//       placeholder="Name"
//       className="w-full py-3 bg-transparent outline-none"
//       onChange={(evt) =>
//         setUserInfo({ ...userInfo, name: evt.target.value })
//       }
//     />
//   </div>

//   <div className="flex items-center w-full gap-2 px-3 border-[1px] rounded-sm border-light-accent1 backdrop-blur-sm">
//     <div className="text-xl text-light-accent1">
//       <AiOutlineMail />
//     </div>
//     <input
//       required
//       type="email"
//       name="email"
//       placeholder="Email Address"
//       className="w-full py-3 bg-transparent outline-none"
//       onChange={(evt) =>
//         setUserInfo({ ...userInfo, email: evt.target.value })
//       }
//     />
//   </div>

//   <div className="flex items-center w-full gap-2 px-3 border-[1px] rounded-sm border-light-accent1 backdrop-blur-sm">
//     <div className="text-xl text-light-accent1">
//       <RiLockPasswordLine />
//     </div>
//     <input
//       required
//       type={showPassword ? "text" : "password"}
//       name="password"
//       placeholder="Password"
//       className="w-full py-3 bg-transparent outline-none "
//       onChange={(evt) =>
//         setUserInfo({ ...userInfo, password: evt.target.value })
//       }
//     />
//     <div
//       onClick={handleClickShowPassword}
//       className="text-xl cursor-pointer text-light-accent1"
//     >
//       {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
//     </div>
//   </div>

//   <div className="flex items-center w-full gap-2">
//     <input type="checkbox" className="cursor-pointer" />
//     <span className="text-sm">
//       I want to receive inspiration , marketing promotions and updates via
//       email.
//     </span>
//   </div>

//   <button
//     type="submit"
//     className="w-full p-2 rounded-sm bg-light-accent1 text-dark-text"
//   >
//     SIGN UP
//   </button>

//   <div className="w-full text-sm text-right text-light-accent1">
//     <Link className="underline" href={"/signIn"}>
//       Already have an account? Sign in
//     </Link>
//   </div>

//   <span className="mt-10 text-sm text-gray-600">
//     Copyright @ NCCBLOG 2023
//   </span>
// </form>
// </div>
