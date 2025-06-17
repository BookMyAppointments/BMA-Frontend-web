'use client';
import { useParams } from "next/navigation"
import LabCreateForm from "./labCreateForm";

export default function Page() {

    const { hospitalId } = useParams<{ hospitalId: string }>();

    return (
        <LabCreateForm id={hospitalId} />
    )
}