import { useState } from 'react'
import type { FC } from 'react'
import Personal from './personal';
import Password from './password';

const ProfileForm: FC = () => {
    const [activeSection, setActiveSection] = useState<'personal' | 'security' | 'preferences'>('personal');

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
                            <button
                                onClick={() => setActiveSection('preferences')}
                                className={`text-left px-4 py-2 rounded-lg ${activeSection === 'preferences'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Preferences
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

                        {activeSection === 'preferences' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800">Preferences</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-700">Email Notifications</h4>
                                            <p className="text-sm text-gray-500">Receive email about your appointments</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-700">SMS Notifications</h4>
                                            <p className="text-sm text-gray-500">Receive SMS reminders for appointments</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-700">WhatsApp Updates</h4>
                                            <p className="text-sm text-gray-500">Receive updates via WhatsApp</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm