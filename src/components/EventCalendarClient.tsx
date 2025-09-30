"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function EventCalendarClient() {
  const [value, setValue] = useState<Value>(new Date());

  return (
    <div>
      <Calendar onChange={setValue} value={value} />
    </div>
  );
}
