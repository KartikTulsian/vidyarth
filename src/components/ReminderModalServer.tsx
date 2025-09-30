import React from "react";
import FormContainer from "./FormContainer";
import { Reminder } from "@prisma/client";

type ReminderWithRelations = Reminder & {
  user?: { name?: string; email?: string };
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ReminderModalServer({
  reminder,
  onCloseUrl,
}: {
  reminder: ReminderWithRelations;
  onCloseUrl: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex flex-col flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              📢 Reminder
            </h2>
            <p className="text-white/80 text-sm sm:text-base">
              <span className="font-medium">{reminder.title}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <FormContainer
              table="reminder"
              type="update"
              data={reminder}
              id={reminder.reminder_id}
            />
            <FormContainer
              table="reminder"
              type="delete"
              id={reminder.reminder_id}
            />
            <a
              href={onCloseUrl}
              className="px-3 py-1 rounded-md text-sm text-gray-600 bg-gray-100"
            >
              Close
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-3">
          <p className="text-gray-700 leading-relaxed">Message: {reminder.message}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Due Date:</span>
              <div>{formatDate(reminder.due_date)}</div>
            </div>
            <div>
              <span className="font-medium">Type:</span>
              <div>{reminder.type}</div>
            </div>
            <div>
              <span className="font-medium">Sent:</span>
              <div>{reminder.is_sent ? "✅ Yes" : "❌ No"}</div>
            </div>
            <div>
              <span className="font-medium">Dismissed:</span>
              <div>{reminder.is_dismissed ? "✅ Yes" : "❌ No"}</div>
            </div>
            <div>
              <span className="font-medium">Created At:</span>
              <div>{formatDate(reminder.created_at)}</div>
            </div>
            {reminder.user && (
              <div>
                <span className="font-medium">User:</span>
                <div>{reminder.user.name || reminder.user.email}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
