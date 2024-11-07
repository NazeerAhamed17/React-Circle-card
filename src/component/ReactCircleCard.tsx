import * as React from "react";
import { State } from "../interfaces";

const ReactCircleCard = ({ updateCallback }) => {
  const [state, setState] = React.useState<State>({
    textLabel: "",
    textValue: "",
    size: 100,
    borderWidth: 2,
    background: "",
  });

  const style: React.CSSProperties = {
    width: state.size,
    height: state.size,
    background: state.background,
    borderWidth: state.borderWidth,
  };

  React.useEffect(() => {
    updateCallback(setState);
  }, [updateCallback]);

  return (
    <div className="circleCard" style={style}>
      <p>
        {state.textLabel}
        <br />
        <em>{state.textValue}</em>
        <br />
        <em>{state.size}</em>
      </p>
    </div>
  );
};

export default ReactCircleCard;
