import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getEvents, postEvent } from "../../../shared/api/calendarAPI";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id?: number;
  title: string;
  start: Date;
  end: Date;
}

interface CalendarEventAPI {
  id: number;
  title: string;
  start: string; // ISO 8601 format
  end: string; // ISO 8601 format
}

export default function MyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    title: "",
    start: new Date(),
    end: new Date(),
  });
  const [titleError, setTitleError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());

  const handleSelectSlot = ({ start, end }: CalendarEvent) => {
    setNewEvent({ title: "", start, end });
    setOpen(true);
    setTitleError(false);
    setTimeError(false);
  };

  const handleSave = () => {
    if (!newEvent.title) {
      setTitleError(true);
      return;
    }
    if (
      !startTime ||
      !endTime ||
      startTime.isAfter(endTime) ||
      startTime.isSame(endTime)
    ) {
      setTimeError(true);
      return;
    }
    setEvents([
      ...events,
      { ...newEvent, start: startTime.toDate(), end: endTime.toDate() },
    ]);
    // 저장되는 데이터 확인
    console.log("새로 저장되는 이벤트:", newEvent);
    console.log("시작 시간:", newEvent.start);
    console.log("종료 시간:", newEvent.end);

    // 전체 이벤트 목록도 확인
    console.log("전체 이벤트 목록:", [...events, newEvent]);

    setOpen(false);
  };

  useEffect(() =>{
    const getAllEvents = async () => {
      try{
        const eventsFromAPI: CalendarEventAPI[] = await getEvents();
        const formattedEvents = eventsFromAPI.map((event) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }
    getAllEvents();
  }, []);


  const handleCancel = () => {
    setOpen(false);
    setNewEvent({ title: "", start: new Date(), end: new Date() });
    setTitleError(false);
    setTimeError(false);
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
        <DialogTitle>Add Schedule</DialogTitle>
        <DialogContent>
          <TextField
            label="Schedule Name"
            fullWidth
            value={newEvent.title}
            error={titleError}
            helperText={titleError ? "Enter your schedule" : ""}
            onChange={(e) => {
              setNewEvent({ ...newEvent, title: e.target.value });
              setTitleError(false);
            }}
          />
          <div className="flex justify-between mt-4 mb-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => {
                  setStartTime(newValue);
                  setTimeError(false); // 시간 수정 시 에러 해제
                }}
                slotProps={{
                  textField: {
                    error: timeError,
                  },
                }}
              />
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => {
                  setEndTime(newValue);
                  setTimeError(false);
                }}
                slotProps={{
                  textField: {
                    error: timeError,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          {timeError && (
            <Alert severity="error">
              시작시간은 종료시간보다 빨라야 합니다.
            </Alert>
          )}
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
