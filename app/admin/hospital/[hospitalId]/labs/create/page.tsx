'use client';
import { useParams } from "next/navigation"
import { LabCreateForm } from ".";

export default function Page() {

    const { hospitalId } = useParams<{ hospitalId: string }>() || {};

    return (
        <LabCreateForm hospitalId={hospitalId} />
    )
}