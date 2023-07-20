import React, { FC, useContext } from "react";
import { IonList } from "@ionic/react";
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
          <>
          <FavItem church={church} key={church.churchId} />
          <br/>
          </>
        )
      })}
      </>
  );
};

export default FavList;