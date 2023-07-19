import React from "react";
import { IonList } from "@ionic/react";
import EventItem from "./EventItem";
import { AllEvents } from "../../context/eventContext";
import LoadingSpinner from "../Global/LoadingSpinner";

interface EventListProps {
  events: AllEvents[];
}

const EventsList: React.FC<EventListProps> = ({ events }) => {
  return (
      <>
      {events.map((event) => (
        <EventItem event={event} key={event.eventId} />
      ))}
      </>
  );
};

export default EventsList;
