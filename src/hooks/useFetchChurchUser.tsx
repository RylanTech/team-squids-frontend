// import { useContext, useEffect, useState, useRef } from "react";
// import { ChurchUserContext, OneChurchUser } from "../context/churchUserContext";
// import { AllEvents } from "../context/eventContext";


// const useFetchChurchUser = (userId: number) => {
//   const { getChurchUser } = useContext(ChurchUserContext);
//   const [churchUser, setChurchUser] = useState<OneChurchUser | undefined>();
//   const [churchUserEvents, setChurchUserEvents] = useState<AllEvents[] | undefined>();
//   const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
//   const [error, setError] = useState<string | undefined>(undefined);

//   const isMountedRef = useRef<boolean | null>(null);
//   useEffect(() => {
//     isMountedRef.current = true;
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoadingStatus(true);
//         const oneChurchUser = await getChurchUser(userId);
//         if (isMountedRef.current) {
//           setChurchUser(oneChurchUser);
//         }
//       } catch (error) {
//         if (isMountedRef.current) {
//           setError(error instanceof Error ? error.message : String(error));
//         }
//       } finally {
//         if (isMountedRef.current) {
//           setLoadingStatus(false);
//         }
//       }
//     };

//     fetchData();
//   }, [userId, getChurchUser]);

//   return { churchUser, loadingStatus, error };
// };

// export { useFetchChurchUser };




import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { ChurchUserContext, OneChurchUser } from "../context/churchUserContext";

const useFetchChurchUser = (userId: number) => {
  const { getChurchUser: getContextChurchUser } = useContext(ChurchUserContext);
  const [churchUser, setChurchUser] = useState<OneChurchUser | undefined>();
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const isMountedRef = useRef<boolean | null>(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getChurchUser = useCallback(getContextChurchUser, []);  // if getContextChurch doesn't have dependencies

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingStatus(true);
        const oneChurchUser = await getChurchUser(userId);
        if (isMountedRef.current) {
          setChurchUser(oneChurchUser);
          setLoadingStatus(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setError(error instanceof Error ? error.message : String(error));
          setLoadingStatus(false);
        }
      }
    };

    fetchData();
  }, [userId, getChurchUser]);  // getChurch reference won't cause unnecessary re-renders

  return { churchUser, loadingStatus, error };
};

export { useFetchChurchUser };

