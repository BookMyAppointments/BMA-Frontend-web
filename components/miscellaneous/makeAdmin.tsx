'use client';
import { useState, useEffect } from "react";
import { Loader2, Search, User } from "lucide-react";
import { toast } from "react-toastify";

interface SearchUser {
    id: string;
    name: string;
    email: string;
}

export default function Page() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchUser | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const searchUsers = async (email: string) => {
        if (!email.trim()) {
            setSearchResults(null);
            setShowSearchResults(false);
            return;
        }

        try {
            setIsSearching(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/search?email=${encodeURIComponent(email)}`,
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

    const handleUserSelect = (userId: string) => {
        setSearchQuery('');
        setSearchResults(null);
        setShowSearchResults(false);
        // Add your logic here for what to do when a user is selected
        console.log('Selected user ID:', userId);
    };

    // Close search results when clicking outside
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
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <button
                            onClick={() => handleUserSelect(searchResults.id)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{searchResults.name}</div>
                                <div className="text-sm text-gray-500">{searchResults.email}</div>
                            </div>
                        </button>
                    </div>
                )}

                {/* No Results Message */}
                {showSearchResults && !searchResults && !isSearching && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="px-4 py-3 text-gray-500 text-center">
                            No users found with this email
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}