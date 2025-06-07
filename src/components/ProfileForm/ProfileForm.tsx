import { useState } from 'react'
import type { FC } from 'react'
import Personal from './personal';
import Password from './password';

const ProfileForm: FC = () => {
    const [activeSection, setActiveSection] = useState<'personal' | 'security'>('personal');

    return (
        <div className="w-[97%] mx-auto mt-6 mb-8">
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Settings</h2>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64">
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveSection('personal')}
                                className={`text-left px-4 py-2 rounded-lg ${activeSection === 'personal'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Personal Information
                            </button>
                            <button
                                onClick={() => setActiveSection('security')}
                                className={`text-left px-4 py-2 rounded-lg ${activeSection === 'security'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Security
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeSection === 'personal' && (
                            <Personal />
                        )}

                        {activeSection === 'security' && (
                            <Password />
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm