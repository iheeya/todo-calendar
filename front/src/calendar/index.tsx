import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

export default function MyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    title: "",
    start: new Date(),
    end: new Date(),
  });

  const handleSelectSlot = ({ start, end }:CalendarEvent) => {
    setNewEvent({ title: "", start, end });
    setOpen(true);
  };

  const handleSave = () => {
    setEvents([...events, newEvent]);
    setOpen(false);
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 500 }}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>일정 추가</DialogTitle>
        <DialogContent>
          <TextField
            label="제목"
            fullWidth
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <Button onClick={handleSave}>저장</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
