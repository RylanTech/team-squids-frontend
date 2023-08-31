import { FC } from "react";
import { AllChurches } from "../../context/churchContext";
import FavItem from "./FavItem";

interface ChurchListProps {
  churches: AllChurches[];
}

const FavList: FC<ChurchListProps> = ( { churches } ) => {

  return (
      <>
      {churches.map((church) => {
        return (
          <div key={church.churchId}>
          <FavItem church={church} />
          <br/>
          </div>
        )
      })}
      </>
  );
};

export default FavList;