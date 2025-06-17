'use client';
import { useParams } from "next/navigation";
import LabEditForm from "./labEditForm";

export default function Page() {

    const { id } = useParams<{ id: string }>();

    return (
        <LabEditForm id={id} />
    )
}