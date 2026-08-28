'use client';
import { useState, useEffect } from "react";
import { Loader2, Search, User, Check, Phone, Mail, UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

interface SearchUser {
    id: string;
    name: string;
    email: string;
    picture: string;
    role: string;
    phone: string;
}

export default function UserSearchBox() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchUser | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isMakingAdmin, setIsMakingAdmin] = useState(false);
    const [adminLinks, setAdminLinks] = useState<{hospital: string, lab: string} | null>(null);
    const [showAdminLinks, setShowAdminLinks] = useState(false);

    const searchUsers = async (email: string) => {
        if (!email.trim()) {
            setSearchResults(null);
            setShowSearchResults(false);
            return;
        }

        try {
            setIsSearching(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/search/user?email=${encodeURIComponent(email)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                toast.error('Failed to search users');
                return;
            }

            const data = await response.json();
            console.log('Search results:', data);
            setSearchResults(data);
            setShowSearchResults(true);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to search users';
            toast.error(errorMessage);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchUsers(searchQuery);
        }
    };

    const makeAdmin = async (email: string) => {
        try {
            setIsMakingAdmin(true);
            setShowAdminLinks(false);
            setAdminLinks(null);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/make-admin?email=${encodeURIComponent(email)}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                toast.error('Failed to make user admin');
                return;
            }

            const data = await response.json();
            console.log('Make admin response:', data);

            if (data.code) {
                const hospitalLink = `${process.env.NEXT_PUBLIC_APP_URL}/register/hospital?uniqueCode=${data.code}`;
                const labLink = `${process.env.NEXT_PUBLIC_APP_URL}/register/lab?uniqueCode=${data.code}`;
                
                setAdminLinks({
                    hospital: hospitalLink,
                    lab: labLink
                });
                setShowAdminLinks(true);
                toast.success('Admin links generated successfully!');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to make user admin';
            toast.error(errorMessage);
        } finally {
            setIsMakingAdmin(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.search-container')) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full">
            {/* Search Box for Adding New Admin */}
            <div className="relative search-container">
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white min-w-80">
                    <Search className="text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search user by email to make admin..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        className="bg-transparent outline-none flex-1 text-gray-600 placeholder-gray-400"
                    />
                    {isSearching && (
                        <Loader2 className="animate-spin text-blue-600" size={16} />
                    )}
                </div>                {/* Search Results Dropdown */}
                {showSearchResults && searchResults && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    {searchResults.picture ? (
                                        <Image
                                            src={searchResults.picture}
                                            alt={searchResults.name}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="text-blue-600" size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 text-lg">{searchResults.name}</div>
                                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                        <Mail className="w-4 h-4" />
                                        <span>{searchResults.email}</span>
                                    </div>
                                    {searchResults.phone && (
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                            <Phone className="w-4 h-4" />
                                            <span>{searchResults.phone}</span>
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <UserCheck className="w-3 h-3 mr-1" />
                                            {searchResults.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => makeAdmin(searchResults.email)}
                                        disabled={isMakingAdmin}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isMakingAdmin ? (
                                            <>
                                                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Make Admin
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showSearchResults && !searchResults && !isSearching && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="px-4 py-3 text-gray-500 text-center">
                            No users found with this email
                        </div>
                    </div>
                )}
            </div>

            {showAdminLinks && adminLinks && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Admin Links Generated!</h3>
                    <p className="text-sm text-green-700 mb-3">
                        Share these links with the user to complete their admin setup:
                    </p>
                    
                    {/* Hospital Admin Link */}
                    <div className="mb-4">
                        <h4 className="text-md font-medium text-green-800 mb-2">Hospital Admin Link:</h4>
                        <div className="bg-white border border-green-300 rounded-md p-3 break-all">
                            <code className="text-sm text-gray-800">{adminLinks.hospital}</code>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(adminLinks.hospital)}
                            className="mt-2 inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Copy Hospital Link
                        </button>
                    </div>

                    {/* Lab Admin Link */}
                    <div>
                        <h4 className="text-md font-medium text-green-800 mb-2">Lab Admin Link:</h4>
                        <div className="bg-white border border-green-300 rounded-md p-3 break-all">
                            <code className="text-sm text-gray-800">{adminLinks.lab}</code>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(adminLinks.lab)}
                            className="mt-2 inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Copy Lab Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}