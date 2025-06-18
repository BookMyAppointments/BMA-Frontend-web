'use client';

import { useParams } from "next/navigation";
import DoctorEditForm from "./doctorEditForm";

export default function Page() {
    const { id } = useParams<{ id: string }>();
    return (
        <DoctorEditForm id={id} />
    )
}