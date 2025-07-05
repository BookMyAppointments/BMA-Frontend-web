"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, CalendarCheck, XCircle, CheckCircle, UserCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

interface Appointment {
  id: string;
  userId: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Doctor {
  id: string;
  name: string;
  picture?: string;
  specialization: string[];
}

export default function DoctorAppointmentsPage() {
  const { id } = useParams<{ id: string }>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/get/${id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch doctor");
        const data = await res.json();
        setDoctor(data);
      } catch {
        toast.error("Could not load doctor info");
      }
    };
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/get/${id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        setAppointments(data.appointments || []);
      } catch {
        toast.error("Could not load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      const uniqueUserIds = Array.from(new Set(appointments.map((a) => a.userId)));
      console.log(uniqueUserIds);

      const userMap: Record<string, User> = {};
      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          if (!userId) return;
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/get/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          if (res.ok) {
            const user = await res.json();
            console.log(user);

            userMap[userId] = user;
          }

        })
      );
      console.log(userMap);

      setUsers(userMap);
    };
    if (appointments.length > 0) fetchUsers();
  }, [appointments]);

  // Categorize appointments
  const categorized = {
    PENDING: appointments.filter((a) => a.status === "PENDING"),
    CONFIRMED: appointments.filter((a) => a.status === "CONFIRMED"),
    COMPLETED: appointments.filter((a) => a.status === "COMPLETED"),
    CANCELLED: appointments.filter((a) => a.status === "CANCELLED"),
    RESCHEDULED: appointments.filter((a) => a.status === "RESCHEDULED"),
  };

  if (loading || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Doctor Info Card */}
        <div className="flex items-center gap-4 bg-white rounded-lg shadow p-6 mb-8">
          {doctor.picture ? (
            <Image
              width={200}
              height={200}
              src={doctor.picture}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <UserCircle2 className="w-16 h-16 text-blue-400" />
          )}
          <div>
            <div className="text-xl font-bold text-gray-900">{doctor.name}</div>
            <div className="text-gray-600 text-sm">
              {doctor.specialization && doctor.specialization.length > 0
                ? doctor.specialization.join(", ")
                : "No specialization"}
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 mb-6">
          <CalendarCheck className="text-blue-600" size={28} />
          Doctor Appointments
        </h1>
        {Object.entries(categorized).map(([status, list]) => (
          <div key={status} className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              {status.charAt(0) + status.slice(1).toLowerCase()} ({list.length})
            </h2>
            {list.length === 0 ? (
              <div className="text-gray-400 text-sm mb-4">No appointments</div>
            ) : (
              <div className="space-y-3">
                {list.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:border-blue-500 border border-transparent transition-all"
                    onClick={() => setSelected(app)}
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {users[app.userId]?.name || "Unknown User"}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {users[app.userId]?.email || ""}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {new Date(app.scheduledAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Appointment Action Dialog */}
        {selected && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Appointment Actions</h3>
              <div className="mb-4">
                <div className="font-medium text-gray-900">
                  {users[selected.userId]?.name || "Unknown User"}
                </div>
                <div className="text-gray-600 text-sm">
                  {users[selected.userId]?.email || ""}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {new Date(selected.scheduledAt).toLocaleString()}
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selected.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : selected.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : selected.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : selected.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {selected.status}
                  </span>
                </div>
              </div>
              {selected.status === "PENDING" && (
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${selected.id}/confirm`,
                          {
                            method: "GET",
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                          }
                        );
                        if (!res.ok) throw new Error("Failed to approve");
                        toast.success("Appointment approved");
                        setSelected(null);
                        window.location.reload();
                      } catch {
                        toast.error("Could not approve");
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${selected.id}/cancel`,
                          {
                            method: "GET",
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                          }
                        );
                        if (!res.ok) throw new Error("Failed to cancel");
                        toast.success("Appointment cancelled");
                        setSelected(null);
                        window.location.reload();
                      } catch {
                        toast.error("Could not cancel");
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}
              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
