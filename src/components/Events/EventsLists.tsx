import React from "react";
import EventItem from "./EventItem";
import { AllEvents } from "../../context/eventContext";

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
