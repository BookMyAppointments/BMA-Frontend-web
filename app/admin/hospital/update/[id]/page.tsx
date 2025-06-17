'use client';
import { useParams } from "next/navigation"
import HospitalUpdateForm from "../hospitalUpdateForm"

export default function Page() {

    const { id } = useParams<{ id: string }>();

    return (
        <HospitalUpdateForm id={id!} />
    )
}