import React, { useContext, useEffect, useState } from "react";
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
  IonDatetime,
  IonModal,
  IonImg,
  IonItem,
  IonCheckbox,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import PageHeader from "../components/Global/PageHeader";
import { EventContext, Event, UpdateEvent } from "../context/eventContext";
import { ChurchUserContext } from "../context/churchUserContext";
import { useFetchChurchUser } from "../hooks/useFetchChurchUser";
import styles from "../theme/forms.module.css";

interface EditEventParams {
  eventId: string;
}

const EditEvent: React.FC = () => {
  const params = useParams<EditEventParams>();
  const { getEvent, updateEvent, postImage } = useContext(EventContext);
  const { currentUserId } = useContext(ChurchUserContext);
  const { churchUser, loadingStatus, error } =
    useFetchChurchUser(currentUserId);
  const today: Date = new Date();

  const [displayedImg, setDisplayedImg] = useState("/svg/church_hive_icon.svg")
  const [isMultiDate, setIsMultiDate] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event>({
    eventId: 0,
    churchId: 0,
    eventTitle: "",
    date: today.toISOString(),
    endDate: today.toISOString(),
    location: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    eventAudience: "",
    eventType: "Youth",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    (async () => {
      const currentEvent = await getEvent(parseInt(params.eventId));
      setCurrentEvent(currentEvent);
      setDisplayedImg(currentEvent.imageUrl)
      const localDate = new Date(currentEvent.date).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      });
      setLocalDate(localDate)
      if (currentEvent.endDate) {
        setIsMultiDate(true)
        const localEndDate = new Date(currentEvent.endDate).toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "short",
        });
        setLocalEndDate(localEndDate);
      }
    })();
  }, []);

  const [localDate, setLocalDate] = useState<string>("");
  const [localEndDate, setLocalEndDate] = useState<string>("");
  const [touchedFields, setTouchedFields] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);

  const history = useHistory();

  const handleInputChange = async (
    name: string,
    value: string | string[] | number | Location | File
  ) => {
    if (name === "date") {
      const isoDate = value as string;
      const localDate = new Date(isoDate).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      });
      setCurrentEvent((prevEvent) => ({
        ...prevEvent,
        date: isoDate,
      }));
      setLocalDate(localDate);
    } else if (name === "endDate") {
      const isoDate = value as string;
      const localDate = new Date(isoDate).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      });
      setCurrentEvent((prevEvent) => ({
        ...prevEvent,
        endDate: isoDate,
      }));
      setLocalEndDate(localDate);
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setCurrentEvent((prevEvent) => ({
        ...prevEvent,
        location: {
          ...prevEvent.location,
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

      setCurrentEvent((prevEvent) => ({
        ...prevEvent,
        imageUrl: imgUrl,
      }));

      setDisplayedImg(imgUrl)

    } else {
      setCurrentEvent((prevEvent) => ({
        ...prevEvent,
        [name]: typeof value === "string" ? (value as string).trim() : value,
      }));
    }
  };

  const handleInputBlur = (name: string) => {
    if (!touchedFields.includes(name)) {
      setTouchedFields([...touchedFields, name]);
    }
  };

  function handleIsMultiDateChecked() {

    if (!isMultiDate) {
      setIsMultiDate(true);

      setTimeout(() => {
        setIsMultiDate(false);
        setCurrentEvent((prevEvent) => ({
          ...prevEvent,
          endDate: null
        }));
        setLocalEndDate("")
      }, 50);
    } else {
      setIsMultiDate(false);

      setTimeout(() => {
        setIsMultiDate(true);
      }, 50);
    }
  }

  const handleSubmit = async (event: any) => {
    const updatedEvent: UpdateEvent = {
      userId: currentUserId,
      eventId: currentEvent.eventId,
      churchId: currentEvent.churchId,
      eventTitle: currentEvent.eventTitle,
      date: currentEvent.date,
      endDate: currentEvent.endDate,
      location: {
        street: currentEvent.location.street,
        city: currentEvent.location.city,
        state: currentEvent.location.state,
        zip: currentEvent.location.zip,
      },
      eventAudience: currentEvent.eventAudience,
      eventType: currentEvent.eventType,
      description: currentEvent.description,
      imageUrl: currentEvent.imageUrl,
    };
    if (updatedEvent.imageUrl === "") {
      updatedEvent.imageUrl = "blank"
    }
    event.preventDefault();
    await updateEvent(updatedEvent);
    history.push(`/user/${currentUserId}`);
  };

  const isFieldTouched = (name: string) => {
    return touchedFields.includes(name);
  };

  return (
    <IonPage>
      <PageHeader header="Edit Event" />
      <IonContent fullscreen className={styles.modal}>
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
                Upload Event Image
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
            <IonCol size="6">
              <IonSelect
                className={`ion-input-field ${
                  isFieldTouched("churchId") ? "" : "ion-untouched"
                }`}
                placeholder="Select Church"
                label="Church"
                labelPlacement="floating"
                value={currentEvent.churchId}
                onIonChange={(e) =>
                  handleInputChange("churchId", e.detail.value!)
                }
                onBlur={() => handleInputBlur("churchId")}
              >
                {churchUser &&
                  churchUser.Churches.map((church) => (
                    <IonSelectOption
                      key={church.churchId}
                      value={church.churchId}
                    >
                      {church.churchName}
                    </IonSelectOption>
                  ))}
              </IonSelect>
            </IonCol>
            <IonCol size="6">
              <IonInput
                className={`ion-input-field ${
                  isFieldTouched("eventTitle") ? "" : "ion-untouched"
                }`}
                required
                type="text"
                label="Event Title"
                labelPlacement="floating"
                value={currentEvent.eventTitle}
                onIonInput={(e) => {
                  const inputValue = e.detail.value;
                  if (inputValue) {
                    if (inputValue.slice(-1) === " ") {
                    } else {
                      handleInputChange("eventTitle", inputValue);
                    }
                  }
                }}
                onBlur={() => handleInputBlur("eventTitle")}
              />
            </IonCol>
            <IonCol size="12">
              <IonItem>
                <IonCheckbox justify="space-between"
                  checked={isMultiDate}
                  onClick={() => {
                    handleIsMultiDateChecked()
                  }}
                >Is the event multiple days?</IonCheckbox>
              </IonItem>
            </IonCol>
            {isMultiDate ? (
              <>
                <IonCol size="12">
                  <IonInput
                    className={`ion-input-field ${isFieldTouched("date") ? "" : "ion-untouched"
                      }`}
                    required
                    type="text"
                    placeholder=""
                    label="Start Event Date and Time"
                    labelPlacement="floating"
                    value={localDate}
                    readonly
                    onClick={() => setShowDatePicker(true)}
                    onBlur={() => handleInputBlur("date")}
                  />
                  <IonModal isOpen={showDatePicker}>
                    <IonDatetime
                      color="primary"
                      value={currentEvent.date}
                      title="Event Start Date"
                      showDefaultTitle={true}
                      showDefaultButtons={true}
                      onIonChange={(e) => {
                        handleInputChange("date", e.detail.value as string);
                        setShowDatePicker(false);
                      }}
                    />
                  </IonModal>
                </IonCol>
                <IonCol size="12">
                  <IonInput
                    className={`ion-input-field ${isFieldTouched("endDate") ? "" : "ion-untouched"
                      }`}
                    required
                    type="text"
                    placeholder=""
                    label="End Event Date and Time"
                    labelPlacement="floating"
                    value={localEndDate}
                    readonly
                    onClick={() => setShowEndDatePicker(true)}
                    onBlur={() => handleInputBlur("endDate")}
                  />
                  <IonModal isOpen={showEndDatePicker}>
                    <IonDatetime
                      color="primary"
                      value={currentEvent.endDate}
                      title="Event End Date"
                      showDefaultTitle={true}
                      showDefaultButtons={true}
                      onIonChange={(e) => {
                        handleInputChange("endDate", e.detail.value as string);
                        setShowEndDatePicker(false);
                      }}
                    />
                  </IonModal>
                </IonCol>
              </>
            ) : (
              <>
                <IonCol size="12">
                  <IonInput
                    className={`ion-input-field ${isFieldTouched("date") ? "" : "ion-untouched"
                      }`}
                    required
                    type="text"
                    placeholder=""
                    label="Event Date and Time"
                    labelPlacement="floating"
                    value={localDate}
                    readonly
                    onClick={() => setShowDatePicker(true)}
                    onBlur={() => handleInputBlur("date")}
                  />
                  <IonModal isOpen={showDatePicker}>
                    <IonDatetime
                      color="primary"
                      value={currentEvent.date}
                      title="Event Date"
                      showDefaultTitle={true}
                      showDefaultButtons={true}
                      onIonChange={(e) => {
                        handleInputChange("endDate", e.detail.value as string);
                        setShowDatePicker(false);
                      }}
                    />
                  </IonModal>
                </IonCol>
              </>
            )}
            <IonCol size="12">
              <IonInput
                className={`ion-input-field ${
                  isFieldTouched("location.street") ? "" : "ion-untouched"
                }`}
                required
                type="text"
                label="Street"
                labelPlacement="floating"
                value={currentEvent.location.street}
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
                className={`ion-input-field ${
                  isFieldTouched("location.city") ? "" : "ion-untouched"
                }`}
                required
                type="text"
                label="City"
                labelPlacement="floating"
                value={currentEvent.location.city}
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
                className={`ion-select-field ${
                  isFieldTouched("location.state") ? "" : "ion-untouched"
                }`}
                placeholder="Select s State"
                label="State"
                labelPlacement="floating"
                value={currentEvent.location.state}
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
                className={`ion-input-field ${
                  isFieldTouched("location.zip") ? "" : "ion-untouched"
                }`}
                required
                type="text"
                label="Zip Code"
                labelPlacement="floating"
                value={currentEvent.location.zip}
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
            <IonCol size="6">
              <IonSelect
                className={`ion-input-field ${
                  isFieldTouched("eventType") ? "" : "ion-untouched"
                }`}
                placeholder="Select Event Type"
                label="Event Type"
                labelPlacement="floating"
                value={currentEvent.eventType}
                onIonChange={(e) =>
                  handleInputChange("eventType", e.detail.value!)
                }
                onBlur={() => handleInputBlur("eventType")}
              >
                <IonSelectOption value="Family">Family</IonSelectOption>
                <IonSelectOption value="Kids">Kids</IonSelectOption>
                <IonSelectOption value="Youth">Youth</IonSelectOption>
                <IonSelectOption value="Young Adults">Young Adults</IonSelectOption>
                <IonSelectOption value="Single">Single</IonSelectOption>
                <IonSelectOption value="Womans">Womans</IonSelectOption>
                <IonSelectOption value="Mens">Mens</IonSelectOption>
                <IonSelectOption value="Senior">Senior</IonSelectOption>
              </IonSelect>
            </IonCol>
            <IonCol size="6">
              <IonSelect
                className={`ion-input-field ${isFieldTouched("eventAudience") ? "" : "ion-untouched"
                  }`}
                placeholder="Select Event Audience"
                label="Event Audience"
                labelPlacement="floating"
                value={currentEvent.eventAudience}
                onIonChange={(e) =>
                  handleInputChange("eventAudience", e.detail.value!)
                }
                onBlur={() => handleInputBlur("eventAudience")}
              >
                <IonSelectOption value="Everyone">Everyone</IonSelectOption>
                <IonSelectOption value="Church-Wide">Church-Wide</IonSelectOption>
                <IonSelectOption value="Church Group">Church Group</IonSelectOption>
              </IonSelect>
            </IonCol>
            <IonCol size="12">
              <IonTextarea
                className={`ion-input-field ${
                  isFieldTouched("description") ? "" : "ion-untouched"
                }`}
                rows={10}
                maxlength={1000}
                label="Description"
                labelPlacement="floating"
                value={currentEvent.description}
                onIonInput={(e) => {
                  const inputValue = e.detail.value;
                  if (inputValue) {
                    if (inputValue.slice(-1) === " ") {
                    } else {
                      handleInputChange("description", inputValue);
                    }
                  }
                }}
                onBlur={() => handleInputBlur("description")}
              />
            </IonCol>
            {/* <IonCol size="12">
              <IonInput
                className={`ion-input-field ${
                  isFieldTouched("imageUrl") ? "" : "ion-untouched"
                }`}
                required
                type="url"
                label="Event Image URL"
                labelPlacement="floating"
                value={currentEvent.imageUrl}
                onIonInput={(e) =>
                  handleInputChange("imageUrl", e.detail.value!)
                }
                onBlur={() => handleInputBlur("imageUrl")}
              />
            </IonCol> */}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default EditEvent;
function postImage(formData: FormData) {
  throw new Error("Function not implemented.");
}

