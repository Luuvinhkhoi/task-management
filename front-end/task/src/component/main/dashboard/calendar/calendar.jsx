import './calendar.css';
import {useState} from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Giả lập các ngày có task và trạng thái
const taskStatusMap = {
  '2025-03-26': 'urgent',
  '2025-03-20': 'inProgress',
  '2025-03-23': 'completed',
};

export const Calendar = () => {
  const [value, setValue] = useState(dayjs());

  // Hàm xác định class cho từng ngày
  const getDayClass = (date) => {
    const key = date.format('YYYY-MM-DD');
    const status = taskStatusMap[key];
    if (status === 'completed') return 'calendar-day completed';
    if (status === 'urgent') return 'calendar-day urgent';
    if (status === 'inProgress') return 'calendar-day in-progress';
    return 'calendar-day'; // mặc định
  };

  return (
    <div id="calendar">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={value}
          onChange={(newValue) => setValue(newValue)}
          slots={{
            day: (props) => {
              const { day, outsideCurrentMonth } = props;
              let className
              if(outsideCurrentMonth){
                className = 'outsideCurrentMonth';
              } else{
                className = getDayClass(day);
              }
              return (
                <div className={className}>
                  {props.children || day.date()}
                </div>
              );
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};
