import { useState } from 'react'
import type { FC } from 'react'

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
                                className={`text-left px-4 py-2 rounded-lg ${
                                    activeSection === 'personal' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Personal Information
                            </button>
                            <button
                                onClick={() => setActiveSection('security')}
                                className={`text-left px-4 py-2 rounded-lg ${
                                    activeSection === 'security' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Security
                            </button>
                            <button
                                onClick={() => setActiveSection('preferences')}
                                className={`text-left px-4 py-2 rounded-lg ${
                                    activeSection === 'preferences' 
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
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <img 
                                            src="/profile-placeholder.png" 
                                            alt="Profile" 
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                        <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue="Rachana Ranade"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Email</label>
                                        <input 
                                            type="email" 
                                            defaultValue="rachana@example.com"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Phone</label>
                                        <input 
                                            type="tel" 
                                            defaultValue="+91 98765 43210"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Location</label>
                                        <input 
                                            type="text" 
                                            defaultValue="Hyderabad"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Current Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
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

                        <div className="mt-8 flex justify-end">
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm