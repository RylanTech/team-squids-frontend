import { InformationCircleOutline } from 'react-ionicons'
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
  IonCheckbox,
  IonItem,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import PageHeader from "../components/Global/PageHeader";
import { EventContext, NewEvent, TriggerInfo } from "../context/eventContext";
import { ChurchUserContext } from "../context/churchUserContext";
import { useFetchChurchUser } from "../hooks/useFetchChurchUser";
import styles from "../theme/forms.module.css";
import { Church } from "../context/churchContext";

const AddEvent: React.FC = () => {
  const { createEvent, postImage } = useContext(EventContext);
  const { currentUserId } = useContext(ChurchUserContext);
  const { churchUser } = useFetchChurchUser(currentUserId);
  const today: Date = new Date();

  const [displayedImg, setDisplayedImg] = useState("/svg/church_hive_icon.svg")
  const [isDateChecked, setIsDateChecked] = useState(false)
  const [isMultiDate, setIsMultiDate] = useState(false)
  const [isDayChecked, setIsDayChecked] = useState(false)
  const [isWeekChecked, setIsWeekChecked] = useState(false)
  const [newEvent, setNewEvent] = useState<NewEvent>({
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
    eventType: "",
    description: "",
    imageUrl: "",
  });

  const [church, setChurch] = useState<Church>({
    churchId: 0,
    userId: 0,
    churchName: "",
    denomination: "",
    location: {
      street: "",
      city: "",
      state: "",
      zip: ""
    },
    phoneNumber: "",
    churchEmail: "",
    welcomeMessage: "",
    serviceTime: "",
    imageUrl: "",
    website: ""
  })

  const [localDate, setLocalDate] = useState<string>("");
  const [localEndDate, setLocalEndDate] = useState<string>("");
  const [touchedFields, setTouchedFields] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [message, setMessage] = useState<string>()

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
      setNewEvent((prevEvent) => ({
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
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        endDate: isoDate,
      }));
      setLocalEndDate(localDate);
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setNewEvent((prevEvent) => ({
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

      setNewEvent((prevEvent) => ({
        ...prevEvent,
        imageUrl: imgUrl,
      }));

      setDisplayedImg(imgUrl)

    } else {
      setNewEvent((prevEvent) => ({
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

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    let evnt = newEvent
    if (newEvent.imageUrl === "") {
      evnt.imageUrl = "blank"
    }
    Submit(evnt)
  };

  async function resettingInputs() {
    setLocalDate("")
    setLocalEndDate("")
    setMessage(undefined)
    setNewEvent({
      churchId: 0,
      eventTitle: "",
      date: "",
      endDate: null,
      location: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      eventAudience: "",
      eventType: "",
      description: "",
      imageUrl: "",
    })
    setChurch({
      churchId: 0,
      userId: 0,
      churchName: "",
      denomination: "",
      location: {
        street: "",
        city: "",
        state: "",
        zip: ""
      },
      phoneNumber: "",
      churchEmail: "",
      welcomeMessage: "",
      serviceTime: "",
      imageUrl: "",
      website: ""
    })
    setDisplayedImg("/svg/church_hive_icon.svg")
    setIsDateChecked(false)
    setIsDayChecked(false)
    setIsWeekChecked(false)
  }

  async function Submit(evnt: any) {
    let triggerInfo: TriggerInfo = {
      body: "Come join us for an upcoming event!",
      title: church.churchName,
      dayBefore: isDayChecked,
      weekBefore: isWeekChecked
    }
    let resp = await createEvent(evnt, triggerInfo);
    console.log(resp)
    if (resp) {

      await resettingInputs().then(() => {
        history.push(`/events`);
      })
    } else {
      setMessage("All feilds must be entered. If you still have issues, try logging out and logging back in.")
    }
  }

  const isFieldTouched = (name: string) => {
    return touchedFields.includes(name);
  };

  useEffect(() => {
    if (churchUser) {
      const selectedChurch: any = churchUser.Churches.find(church => church.churchId === newEvent.churchId);
      if (selectedChurch?.location) {
        try {
          selectedChurch.location = JSON.parse(selectedChurch.location); // Parse the JSON string
          setChurch(selectedChurch);
        } catch (error) {
          console.error("Error parsing location JSON:", error);
        }
      }
    }
  }, [newEvent.churchId]);

  function isSameDay(date1ISO: string, date2: Date) {
    const date1 = new Date(date1ISO);

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function is8DaysBefore(dateString: string): boolean {
    // Convert the string input to a Date object
    const dateInput = new Date(dateString);

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = dateInput.getTime() - currentDate.getTime();

    // Calculate the difference in days
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    // Check if the difference is within 8 days or less
    return daysDifference >= 0 && daysDifference <= 8;
  }

  function handleIsDateChecked() {

    if (!isDateChecked) {
      setIsDateChecked(true);
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        location: {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
      }));

      // The timers are because the amound off callbacks are unpredictable from the Ioncheckbox
      setTimeout(() => {
        setIsDateChecked(false);
      }, 50);
    } else {
      setIsDateChecked(false);
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        location: church.location
      }));

      setTimeout(() => {
        setIsDateChecked(true);
      }, 50);
    }
  }

  function handleIsDayChecked() {

    if (!isDayChecked) {
      setIsDayChecked(false)

      setTimeout(() => {
        setIsDayChecked(true);
      }, 50);
    } else {
      setIsDayChecked(true);

      setTimeout(() => {
        setIsDayChecked(false);
      }, 50);
    }
  }

  function handleIsWeekChecked() {

    if (!isWeekChecked) {
      setIsWeekChecked(false)

      setTimeout(() => {
        setIsWeekChecked(true);
      }, 50);
    } else {
      setIsWeekChecked(true);

      setTimeout(() => {
        setIsWeekChecked(false);
      }, 50);
    }
  }

  function handleIsMultiDateChecked() {

    if (!isMultiDate) {
      setIsMultiDate(true);

      setTimeout(() => {
        setIsMultiDate(false);
        setNewEvent((prevEvent) => ({
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


  function returnNotiDay() {
    if (!isSameDay(newEvent.date, new Date)) {
      return (
        <>
          <IonCheckbox justify="space-between"
            checked={isDayChecked}
            onClick={() => {
              handleIsDayChecked()
            }}
          >Send a notification the day before
          </IonCheckbox>
        </>

      )
    } else {
      return (
        <>
          <IonCheckbox justify="space-between"
            disabled
          >Send a notification the day before
          </IonCheckbox>
        </>
      )
    }
  }

  function returnNotiWeek() {
    if (!isSameDay(newEvent.date, new Date)) {
      if (is8DaysBefore(newEvent.date)) {
        return (
          <>
            <IonCheckbox justify="space-between"
              disabled
            >Send a notification the week before
            </IonCheckbox>
          </>
        )
      } else {
        return (
          <>
            <IonCheckbox justify="space-between"
              checked={isWeekChecked}
              onClick={() => {
                handleIsWeekChecked()
              }}
            >Send a notification the week before
            </IonCheckbox>
          </>
        )
      }
    } else {
      return (
        <>
          <IonCheckbox justify="space-between"
            disabled
          >Send a notification the week before
          </IonCheckbox>
        </>
      )
    }
  }

  return (
    <IonPage>
      <PageHeader header="Add Event" />
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
          </IonRow>
          <IonRow>
            <IonCol size="12">
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
              <IonCol size='12s'>
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
            </IonCol>
            <IonCol size="6">
              <IonSelect
                className={`ion-input-field ${isFieldTouched("churchId") ? "" : "ion-untouched"
                  }`}
                placeholder="Select Church"
                label="Church"
                labelPlacement="floating"
                value={newEvent.churchId}
                onIonChange={(e) => {
                  handleInputChange("churchId", e.detail.value)
                }
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
                className={`ion-input-field ${isFieldTouched("eventTitle") ? "" : "ion-untouched"
                  }`}
                required
                type="text"
                label="Event Title"
                labelPlacement="floating"
                value={newEvent.eventTitle}
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
                <IonCol size="6">
                  <IonItem>
                    <IonInput
                      className={`ion-input-field ${isFieldTouched("date") ? "" : "ion-untouched"
                        }`}
                      required
                      type="text"
                      placeholder=""
                      label="Start Event Date"
                      labelPlacement="floating"
                      value={localDate}
                      readonly
                      onClick={() => setShowDatePicker(true)}
                      onBlur={() => handleInputBlur("date")}
                    />
                    <IonModal isOpen={showDatePicker}>
                      <IonDatetime
                        color="primary"
                        value={newEvent.date}
                        title="Event Start Date"
                        showDefaultTitle={true}
                        showDefaultButtons={true}
                        onIonCancel={() => {
                          setShowDatePicker(false);
                        }}
                        onIonChange={(e) => {
                          handleInputChange("date", e.detail.value as string);
                          setShowDatePicker(false);
                        }}
                      />
                    </IonModal>
                  </IonItem>
                </IonCol>
                <IonCol size="6">
                  <IonItem>
                    <IonInput
                      className={`ion-input-field ${isFieldTouched("endDate") ? "" : "ion-untouched"
                        }`}
                      required
                      type="text"
                      placeholder=""
                      label="End Event Date"
                      labelPlacement="floating"
                      value={localEndDate}
                      readonly
                      onClick={() => setShowEndDatePicker(true)}
                      onBlur={() => handleInputBlur("endDate")}
                    />
                    <IonModal isOpen={showEndDatePicker}>
                      <IonDatetime
                        color="primary"
                        value={newEvent.endDate}
                        title="Event End Date"
                        showDefaultTitle={true}
                        showDefaultButtons={true}
                        onIonCancel={() => setShowEndDatePicker(false)}
                        onIonChange={(e) => {
                          handleInputChange("endDate", e.detail.value as string);
                          setShowEndDatePicker(false);
                        }}
                      />
                    </IonModal>
                  </IonItem>
                </IonCol>
                <IonItem>
                  <InformationCircleOutline
                    style={{ marginTop: "6px", marginRight: "10px" }}
                    color={'#c70000'}
                    height="35px"
                    width="35px"
                  />
                  <div style={{ color: "#c70000" }}>
                    Please explain how your event times in the description
                  </div>
                </IonItem>
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
                      value={newEvent.date}
                      title="Event Date"
                      showDefaultTitle={true}
                      showDefaultButtons={true}
                      onIonCancel={() => setShowDatePicker(false)}
                      onIonChange={(e) => {
                        handleInputChange("date", e.detail.value as string);
                        setShowDatePicker(false);
                      }}
                    />
                  </IonModal>
                </IonCol>
              </>
            )}
            <IonCol size='12'>
              <IonItem>
                {returnNotiDay()}
              </IonItem>
            </IonCol>
            <IonCol size='12'>
              <IonItem>
                {returnNotiWeek()}
              </IonItem>
            </IonCol>
            <IonCol size="12">
              <IonInput
                className={`ion-input-field ${isFieldTouched("location.street") ? "" : "ion-untouched"
                  }`}
                required
                type="text"
                label="Street"
                labelPlacement="floating"
                value={newEvent.location.street}
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
                value={newEvent.location.city}
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
                value={newEvent.location.state}
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
                <IonSelectOption value="Connecticut">Connecticut</IonSelectOption>
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
                value={newEvent.location.zip}
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
            <IonCol size="12">
              <IonItem>
                {church.churchId !== 0 ? (
                  <IonCheckbox justify="space-between"
                    checked={isDateChecked}
                    onClick={() => {
                      handleIsDateChecked()
                    }}
                  >Address is the same as church</IonCheckbox>
                ) : (
                  <IonCheckbox justify="space-between"
                    disabled
                  >Address is the same as church</IonCheckbox>
                )}
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonSelect
                className={`ion-input-field ${isFieldTouched("eventType") ? "" : "ion-untouched"
                  }`}
                placeholder="Select Event Type"
                label="Event Type"
                labelPlacement="floating"
                value={newEvent.eventType}
                onIonChange={(e) =>
                  handleInputChange("eventType", e.detail.value!)
                }
                onBlur={() => handleInputBlur("eventType")}
              >
                <IonSelectOption value="Family">Family</IonSelectOption>
                <IonSelectOption value="Youth">Youth</IonSelectOption>
                <IonSelectOption value="Young Adults">
                  Young Adults
                </IonSelectOption>
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
                value={newEvent.eventAudience}
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
                className={`ion-input-field ${isFieldTouched("description") ? "" : "ion-untouched"
                  }`}
                rows={10}
                maxlength={1000}
                label="Description"
                labelPlacement="floating"
                value={newEvent.description}
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
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage >
  );
};

export default AddEvent;
