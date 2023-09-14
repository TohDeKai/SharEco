import { createTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

const shareCoTheme = createTheme({
  palette: {
    primary: {
      main: "#419682",
    },
  },
});

const FooterBox = styled("div")({
  position: "fixed",
  width: "100%",
  bottom: 0,
  margin: 0,
  padding: 0,
  zIndex: -1,
});

export const styles = {
  shareCoTheme: shareCoTheme,
  FooterBox: FooterBox,
};
