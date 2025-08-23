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
  Typography,
  DialogActions,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getEvents,
  postEvent,
  deleteEvent,
} from "../../../shared/api/calendarAPI";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id?: number;
  title: string;
  start: Date;
  end: Date;
}

interface CalendarEventAPI {
  id?: number;
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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 빈 슬롯 선택
  const handleSelectSlot = ({ start, end }: CalendarEvent) => {
    setNewEvent({ title: "", start, end });
    setOpen(true);
    setTitleError(false);
    setTimeError(false);
  };

  // 기존 이벤트 선택
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
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

    const eventToPost = async () => {
      try {
        const eventForAPI: CalendarEventAPI = {
          title: newEvent.title,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
        };
        await postEvent(eventForAPI);
      } catch (error) {
        console.error("Failed to post event:", error);
      }
    };
    eventToPost();

    setOpen(false);
  };

  useEffect(() => {
    const getAllEvents = async () => {
      try {
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
    };
    getAllEvents();
  }, []);

  const handleCancel = () => {
    setOpen(false);
    setNewEvent({ title: "", start: new Date(), end: new Date() });
    setTitleError(false);
    setTimeError(false);
  };

  // 이벤트 삭제 핸들러

  const handleDeleteConfirm = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        await deleteEvent(selectedEvent.id);
        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        console.log("일정이 삭제되었습니다:", selectedEvent.title);
      } catch (error) {
        console.error("일정 삭제 실패:", error);
        alert("일정 삭제에 실패했습니다.");
      }
    }
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  // 일정 삭제 취소
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
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

      {/* 일정 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>일정 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>"{selectedEvent?.title}"</strong> 일정을 삭제하시겠습니까?
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginTop: "8px" }}
          >
            {selectedEvent && (
              <>
                📅 {moment(selectedEvent.start).format("YYYY년 MM월 DD일")}{" "}
                <br />
                🕐 {moment(selectedEvent.start).format("HH:mm")} -{" "}
                {moment(selectedEvent.end).format("HH:mm")}
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>취소</Button>
          <Button onClick={handleDeleteConfirm}>삭제</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
