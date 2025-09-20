import ProfileForm from "./components/ProfileForm";

export default function ProfileSettings() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 w-full">
                <ProfileForm />
            </main>
        </div>
    );
}