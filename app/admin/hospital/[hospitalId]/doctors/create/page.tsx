'use client';
import { useParams } from "next/navigation";
import DoctorCreateForm from "./doctorCreateForm";

export default function Page() {
    const { hospitalId } = useParams<{ hospitalId: string }>() as Record<string, string>;

    return (
        <DoctorCreateForm hospitalId={hospitalId} />
    )
}