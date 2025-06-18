'use client';
import { useParams } from "next/navigation";
import DoctorCreateForm from "./doctorCreateForm";

export default function Page() {
    const { userId, hospitalId } = useParams<{ userId: string, hospitalId: string }>();

    return (
        <DoctorCreateForm userId={userId} hospitalId={hospitalId} />
    )
}