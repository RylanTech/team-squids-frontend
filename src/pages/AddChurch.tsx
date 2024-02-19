import React, { useContext, useState } from "react";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonInput,
  IonButton,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonImg,
  IonItem,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import PageHeader from "../components/Global/PageHeader";
import { ChurchContext, NewChurch } from "../context/churchContext";
import { ChurchUserContext } from "../context/churchUserContext";
import styles from "../theme/forms.module.css";
import { EventContext } from "../context/eventContext";
import { InformationCircleOutline } from "react-ionicons";

const AddChurch: React.FC = () => {
  const { postImage } = useContext(EventContext);
  const { createChurch } = useContext(ChurchContext);
  const { currentUserId, getChurchUser } = useContext(ChurchUserContext);
  const [newChurch, setNewChurch] = useState<NewChurch>({
    userId: currentUserId,
    churchName: "",
    denomination: "",
    location: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    phoneNumber: "",
    churchEmail: "",
    welcomeMessage: "",
    serviceTime: "",
    imageUrl: "",
    website: "",
  });
  const [touchedFields, setTouchedFields] = useState<string[]>([]);
  const [message, setMessage] = useState<String>()
  const [displayedImg, setDisplayedImg] = useState("/svg/church_hive_icon.svg")

  const history = useHistory();

  const handleInputChange = async (
    name: string,
    value: string | number | Location | File
  ) => {
    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setNewChurch((prevChurch) => ({
        ...prevChurch,
        location: {
          ...prevChurch.location,
          [key]: typeof value === "string" ? (value as string).trim() : value,
        },
      }));
    } else if (name === "imageFile" && value instanceof File) {
      const currentTime = new Date().getTime();

      const imageName = `image_${currentTime}-${value.name}`;

      const newFile = new File([value], imageName, {
        type: value.type,
      });

      const formData = new FormData();
      formData.append("image", newFile);

      const imgName = await postImage(formData)

      const imgUrl = `https://churchhive.net${imgName.imageUrl}`

      setNewChurch((prevEvent) => ({
        ...prevEvent,
        imageUrl: imgUrl,
      }));

      setDisplayedImg(imgUrl)

    } else {
      setNewChurch((prevChurch) => ({
        ...prevChurch,
        [name]: typeof value === "string" ? (value as string).trim() : value,
      }));
    }
  };

  const handleInputBlur = (name: string) => {
    if (!touchedFields.includes(name)) {
      setTouchedFields([...touchedFields, name]);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    let resp = await createChurch(newChurch);
    await getChurchUser(currentUserId);
    if (resp) {
      history.push(`/churches`);
      setMessage(undefined)
      setNewChurch({
        userId: currentUserId,
        churchName: "",
        denomination: "",
        location: {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        phoneNumber: "",
        churchEmail: "",
        welcomeMessage: "",
        serviceTime: "",
        imageUrl: "",
        website: "",
      })
      setDisplayedImg("/svg/church_hive_icon.svg");
    } else {
      setMessage("All feilds must be entered. The church cannot have the same name of another church. If you still have issues, try logging out and logging back in.")
    }
  };

  const isFieldTouched = (name: string) => {
    return touchedFields.includes(name);
  };

  return (
    <>
      <IonPage>
        <PageHeader header="Add Church" />
        <IonContent fullscreen>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div className={styles.header}>
                  <IonImg
                    src={displayedImg}
                    className={styles.logo}
                  />
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              {message ? (
                <IonItem>
                  <InformationCircleOutline
                    style={{ marginTop: "6px", marginRight: "10px" }}
                    color={'#c70000'}
                    height="35px"
                    width="35px"
                  />
                  <div style={{ color: "#c70000" }}>
                    {message}
                  </div>
                </IonItem>
              ) : (
                <></>
              )}
              <IonCol size="12">
                <IonButton
                  expand="full"
                  onClick={handleSubmit}
                  className={styles.button}
                >
                  Submit
                </IonButton>
              </IonCol>
              <IonCol size="12">
                <IonButton
                  className={`ion-input-field ${isFieldTouched("imageFile") ? "" : "ion-untouched"}`}
                  expand="full"
                  fill="solid"
                  color="primary"
                >
                  Upload Church Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files && e.target.files[0];
                      if (selectedFile) {
                        handleInputChange("imageFile", selectedFile);
                      }
                    }}
                    style={{ opacity: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: "pointer" }}
                  />
                </IonButton>
              </IonCol>
              <IonCol size="7">
                <IonInput
                  className={`ion-input-field ${isFieldTouched("churchName") ? "" : "ion-untouched"
                    }`}
                  required
                  type="text"
                  label="Church Name"
                  labelPlacement="floating"
                  value={newChurch.churchName}
                  onIonInput={(e) => {
                    const inputValue = e.detail.value;
                    if (inputValue) {
                      if (inputValue.slice(-1) === " ") {
                      } else {
                        handleInputChange("churchName", inputValue);
                      }
                    }
                  }}
                  onBlur={() => handleInputBlur("churchName")}
                />
              </IonCol>
              <IonCol size="5">
                <IonInput
                  className={`ion-input-field ${isFieldTouched("denomination") ? "" : "ion-untouched"
                    }`}
                  required
                  type="text"
                  label="Denomination"
                  labelPlacement="floating"
                  value={newChurch.denomination}
                  onIonInput={(e) => {
                    const inputValue = e.detail.value;
                    if (inputValue) {
                      if (inputValue.slice(-1) === " ") {
                      } else {
                        handleInputChange("denomination", inputValue);
                      }
                    }
                  }}
                  onBlur={() => handleInputBlur("denomination")}
                />
              </IonCol>
              <IonCol size="12">
                <IonInput
                  className={`ion-input-field ${isFieldTouched("location.street") ? "" : "ion-untouched"
                    }`}
                  required
                  type="text"
                  label="Street"
                  labelPlacement="floating"
                  value={newChurch.location.street}
                  onIonInput={(e) => {
                    const inputValue = e.detail.value;
                    if (inputValue) {
                      if (inputValue.slice(-1) === " ") {
                      } else {
                        handleInputChange("location.street", inputValue);
                      }
                    }
                  }}
                  onBlur={() => handleInputBlur("location.street")}
                />
              </IonCol>
              <IonCol size="7">
                <IonInput
                  className={`ion-input-field ${isFieldTouched("location.city") ? "" : "ion-untouched"
                    }`}
                  required
                  type="text"
                  label="City"
                  labelPlacement="floating"
                  value={newChurch.location.city}
                  onIonInput={(e) => {
                    const inputValue = e.detail.value;
                    if (inputValue) {
                      if (inputValue.slice(-1) === " ") {
                      } else {
                        handleInputChange("location.city", inputValue);
                      }
                    }
                  }}
                  onBlur={() => handleInputBlur("location.city")}
                />
              </IonCol>
              <IonCol size="3">
                <IonSelect
                  className={`ion-select-field ${isFieldTouched("location.state") ? "" : "ion-untouched"
                    }`}
                  placeholder="Select s State"
                  label="State"
                  labelPlacement="floating"
                  value={newChurch.location.state}
                  onIonChange={(e) => {
                    const selectedValue = e.detail.value;
                    handleInputChange("location.state", selectedValue);
                  }}
                  onBlur={() => handleInputBlur("location.state")}
                >
                  <IonSelectOption value="Alabama">Alabama</IonSelectOption>
                  <IonSelectOption value="Alaska">Alaska</IonSelectOption>
                  <IonSelectOption value="Arizona">Arizona</IonSelectOption>
                  <IonSelectOption value="Arkansas">Arkansas</IonSelectOption>
                  <IonSelectOption value="California">California</IonSelectOption>
                  <IonSelectOption value="Colorado">Colorado</IonSelectOption>
                  <IonSelectOption value="Connecticut">
                    Connecticut
                  </IonSelectOption>
                  <IonSelectOption value="Delaware">Delaware</IonSelectOption>
                  <IonSelectOption value="Florida">Florida</IonSelectOption>
                  <IonSelectOption value="Georgia">Georgia</IonSelectOption>
                  <IonSelectOption value="Hawaii">Hawaii</IonSelectOption>
                  <IonSelectOption value="Idaho">Idaho</IonSelectOption>
                  <IonSelectOption value="Illinois">Illinois</IonSelectOption>
                  <IonSelectOption value="Indiana">Indiana</IonSelectOption>
                  <IonSelectOption value="Iowa">Iowa</IonSelectOption>
                  <IonSelectOption value="Kansas">Kansas</IonSelectOption>
                  <IonSelectOption value="Kentucky">Kentucky</IonSelectOption>
                  <IonSelectOption value="Louisiana">Louisiana</IonSelectOption>
                  <IonSelectOption value="Maine">Maine</IonSelectOption>
                  <IonSelectOption value="Maryland">Maryland</IonSelectOption>
                  <IonSelectOption value="Massachusetts">
                    Massachusetts
                  </IonSelectOption>
                  <IonSelectOption value="Michigan">Michigan</IonSelectOption>
                  <IonSelectOption value="Minnesota">Minnesota</IonSelectOption>
                  <IonSelectOption value="Mississippi">
                    Mississippi
                  </IonSelectOption>
                  <IonSelectOption value="Missouri">Missouri</IonSelectOption>
                  <IonSelectOption value="Montana">Montana</IonSelectOption>
                  <IonSelectOption value="Nebraska">Nebraska</IonSelectOption>
                  <IonSelectOption value="Nevada">Nevada</IonSelectOption>
                  <IonSelectOption value="New Hampshire">
                    New Hampshire
                  </IonSelectOption>
                  <IonSelectOption value="New Jersey">New Jersey</IonSelectOption>
                  <IonSelectOption value="New Mexico">New Mexico</IonSelectOption>
                  <IonSelectOption value="New York">New York</IonSelectOption>
                  <IonSelectOption value="North Carolina">
                    North Carolina
                  </IonSelectOption>
                  <IonSelectOption value="North Dakota">
                    North Dakota
                  </IonSelectOption>
                  <IonSelectOption value="Ohio">Ohio</IonSelectOption>
                  <IonSelectOption value="Oklahoma">Oklahoma</IonSelectOption>
                  <IonSelectOption value="Oregon">Oregon</IonSelectOption>
                  <IonSelectOption value="Pennsylvania">
                    Pennsylvania
                  </IonSelectOption>
                  <IonSelectOption value="Rhode Island">
                    Rhode Island
                  </IonSelectOption>
                  <IonSelectOption value="South Carolina">
                    South Carolina
                  </IonSelectOption>
                  <IonSelectOption value="South Dakota">
                    South Dakota
                  </IonSelectOption>
                  <IonSelectOption value="Tennessee">Tennessee</IonSelectOption>
                  <IonSelectOption value="Texas">Texas</IonSelectOption>
                  <IonSelectOption value="Utah">Utah</IonSelectOption>
                  <IonSelectOption value="Vermont">Vermont</IonSelectOption>
                  <IonSelectOption value="Virginia">Virginia</IonSelectOption>
                  <IonSelectOption value="Washington">Washington</IonSelectOption>
                  <IonSelectOption value="West Virginia">
                    West Virginia
                  </IonSelectOption>
                  <IonSelectOption value="Wisconsin">Wisconsin</IonSelectOption>
                  <IonSelectOption value="Wyoming">Wyoming</IonSelectOption>
                </IonSelect>
              </IonCol>
              <IonCol size="2">
                <IonInput
                  className={`ion-input-field ${isFieldTouched("location.zip") ? "" : "ion-untouched"
                    }`}
                  required
                  type="text"
                  label="Zip"
                  labelPlacement="floating"
                  value={newChurch.location.zip}
                  onIonInput={(e) => {
                    const inputValue = e.detail.value;
                    if (inputValue) {
                      if (inputValue.slice(-1) === " ") {
                      } else {
                        handleInputChange("location.zip", inputValue);
                      }
                    }
                  }}
                  onBlur={() => handleInputBlur("location.zip")}
                />
              </IonCol>
              <IonCol size="5">
                <IonInput
                  className={`ion-input-field ${isFieldTouched("phoneNumber") ? "" : "ion-untouched"
                    }`}
                  required
                  type="tel"
                  label="Phone Number"
                  labelPlacement="floating"
                  value={newChurch.phoneNumber}
                  onIonInput={(e) => {
                    const inputValue = e.detail.value;
                    if (inputValue) {
                      if (inputValue.slice(-1) === " ") {
                      } else {
                        handleInputChange("phoneNumber", inputValue);
                      }
                    }
                  }}
                  onBlur={() => handleInputBlur("phoneNumber")}
                />
              </IonCol>
              <IonCol size="7">
                <IonInput
                  className={`ion-input-field ${isFieldTouched("churchEmail") ? "" : "ion-untouched"
                    }`}
                  required
                  type="email"
                  label="Church Email"
                  labelPlacement="floating"
                  value={newChurch.churchEmail}
                  onIonInput={(e) =>
                    handleInputChange("churchEmail", e.detail.value!)
                  }
                  onBlur={() => handleInputBlur("churchEmail")}
                />
              </IonCol>
              <IonCol size="12">
                <IonInput
                  className={`ion-input-field ${isFieldTouched("serviceTime") ? "" : "ion-untouched"
                    }`}
                  required
                  type="text"
                  label="Service Times"
                  labelPlacement="floating"
                  value={newChurch.serviceTime}
                  onIonInput={(e) => {
                    const inputValue = e.detail.value;
                    if (inputValue) {
                      if (inputValue.slice(-1) === " ") {
                      } else {
                        handleInputChange("serviceTime", inputValue);
                      }
                    }
                  }}
                  onBlur={() => handleInputBlur("serviceTime")}
                />
              </IonCol>
              <IonCol size="12">
                <IonInput
                  className={`ion-input-field ${isFieldTouched("website") ? "" : "ion-untouched"
                    }`}
                  required
                  type="url"
                  label="Church Website"
                  labelPlacement="floating"
                  value={newChurch.website}
                  onIonInput={(e) =>
                    handleInputChange("website", e.detail.value!)
                  }
                  onBlur={() => handleInputBlur("website")}
                />
              </IonCol>
              <IonCol size="12">
                <IonTextarea
                  className={`ion-input-field ${isFieldTouched("welcomeMessage") ? "" : "ion-untouched"
                    }`}
                  required
                  label="Welcome Message"
                  labelPlacement="floating"
                  rows={10}
                  maxlength={1000}
                  value={newChurch.welcomeMessage}
                  onIonInput={(e) => {
                    const inputValue = e.detail.value;
                    if (inputValue) {
                      if (inputValue.slice(-1) === " ") {
                      } else {
                        handleInputChange("welcomeMessage", inputValue);
                      }
                    }
                  }}
                  onBlur={() => handleInputBlur("welcomeMessage")}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export default AddChurch;
