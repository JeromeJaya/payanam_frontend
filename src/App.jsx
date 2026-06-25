import { useContext } from "react";
import { UserContext } from "./UserContext";

function GrandChild() {
  const name = useContext(UserContext);

  return <h1>{name}</h1>;
}

export default GrandChild;