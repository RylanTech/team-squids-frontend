import { IonCol, IonButton, IonRow, IonInput, IonAlert } from "@ionic/react";
import { useState, useContext } from "react";
import { useHistory } from "react-router";
import {
  ChurchUserContext,
  LoginChurchUser,
} from "../context/churchUserContext";
import styles from "../theme/forms.module.css";

const LoginAccount: React.FC = () => {
  const [loginUser, setLoginUser] = useState<LoginChurchUser>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("Login")

  const { currentUserId, loginChurchUser, verifyCurrentUser } =
    useContext(ChurchUserContext);

  const history = useHistory();

  const handleInputChange = (name: string, value: string | number) => {
    setLoginUser((prevValue) => ({
      ...prevValue,
      [name]: typeof value === "string" ? (value as string).trim() : value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    loginChurchUser(loginUser).then((resp) => {
      if (resp) {
        setMessage("Login")
        history.push(`/user/${resp.userId}`);
      } else {
        setMessage("Invalid Email or Password")
      }
    });
  };

  const [touchedFields, setTouchedFields] = useState<string[]>([]);

  const isFieldTouched = (name: string) => {
    return touchedFields.includes(name);
  };

  const handleInputBlur = (name: string) => {
    if (!touchedFields.includes(name)) {
      setTouchedFields([...touchedFields, name]);
    }
  };

  return (
    <>
      <center>
        <p className={styles.loginTitle}>
          {message}
        </p>
      </center>
    <IonRow>
      <IonCol size="12">
        <IonInput
          className={`ion-input-field ${
            isFieldTouched("email") ? "" : "ion-untouched"
          }`}
          required
          type="email"
          label="Email Address"
          labelPlacement="floating"
          value={loginUser.email}
          onIonInput={(e) => handleInputChange("email", e.detail.value!)}
          onBlur={() => handleInputBlur("email")}
        />
      </IonCol>
      <IonCol size="12">
        <IonInput
          className={`ion-input-field ${
            isFieldTouched("password") ? "" : "ion-untouched"
          }`}
          required
          type="password"
          label="Password"
          labelPlacement="floating"
          value={loginUser.password}
          onIonInput={(e) => handleInputChange("password", e.detail.value!)}
          onBlur={() => handleInputBlur("password")}
        />
      </IonCol>
      <IonCol size="12">
        <IonButton expand="full" onClick={handleSubmit} className={styles.button}>
          Submit
        </IonButton>
      </IonCol>
    </IonRow>
    <IonAlert
    trigger="present-alert"
    header="Alert"
    sub-header="Important message"
    message="This is an alert!"
    />
    </>
  );
};

export default LoginAccount;
