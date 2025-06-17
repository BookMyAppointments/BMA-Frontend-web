'use client';
import { useParams } from "next/navigation"

export default function Page() {

    const { hospitalId } = useParams<{ hospitalId: string }>();

    return (
        <><h1>Lab Details for Hospital ID: {hospitalId}</h1></>
    )
}