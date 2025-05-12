import "./App.css";
import { icons } from "./components/icons";
function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <icons.dropdown />
      <icons.export />
      <icons.upload />
      <icons.loop />
    </>
  );
}

export default App;
