import { CssBaseline } from "@mui/material/";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import EditorMenu from "./EditorMenu";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EditorMenu />
    </ThemeProvider>
  );
};

export default App;
