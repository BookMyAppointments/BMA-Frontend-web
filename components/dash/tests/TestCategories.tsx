import type { FC } from 'react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface TestCategory {
    category: string;
    _count: {
        category: number;
    };
}

interface TestCategoriesProps {
    onCategoryChange: (category: string) => void;
    initialCategory: string;
    categories: TestCategory[];
}

const TestCategories: FC<TestCategoriesProps> = ({ onCategoryChange, initialCategory, categories }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Biochemistry');
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                el.scrollLeft += e.deltaY * 2;
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            el.removeEventListener('wheel', onWheel);
        };
    }, []);

    useEffect(() => {
        setSelectedCategory(initialCategory || 'Biochemistry');
    }, [initialCategory]);

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
        if (onCategoryChange) {
            onCategoryChange(categoryName);
        }
    };

    // Category icons mapping
    const getCategoryIcon = (category: string) => {
        const iconMap: { [key: string]: string } = {
            'Biochemistry': '/icons/cat.png',
            'Cardiology': '/icons/cat.png',
            'Diabetes': '/icons/cat.png',
            'Endocrinology': '/icons/cat.png',
            'Hematology': '/icons/cat.png',
            'Radiology': '/icons/cat.png',
            'Vitamins': '/icons/cat.png'
        };
        return iconMap[category] || '/icons/cat.png';
    };

    const getCategoryDescription = (category: string) => {
        const descriptionMap: { [key: string]: string } = {
            'Biochemistry': 'Blood chemistry analysis',
            'Cardiology': 'Heart function tests',
            'Diabetes': 'Blood sugar monitoring',
            'Endocrinology': 'Hormone level tests',
            'Hematology': 'Blood cell analysis',
            'Radiology': 'X-ray & imaging tests',
            'Vitamins': 'Vitamin deficiency tests'
        };
        return descriptionMap[category] || 'Medical testing';
    };

    return (
        <div className="w-full py-1.5 px-2 lg:py-3 lg:px-6">
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-1.5 lg:gap-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth pb-1"
            >
                {categories.map((category) => (
                    <div
                        key={category.category}
                        onClick={() => handleCategorySelect(category.category)}
                        className={`flex items-center gap-1.5 lg:gap-2 p-1.5 lg:p-2 rounded-md lg:rounded-xl transition-all cursor-pointer shrink-0 w-[140px] lg:w-[200px]
                            ${selectedCategory === category.category
                                ? 'bg-[#0066FF] text-white'
                                : 'bg-[#F8F8F8] hover:bg-gray-100'
                            }`}
                    >
                        <div className={`w-5 h-5 lg:w-8 lg:h-8 flex items-center justify-center rounded-full p-1 lg:p-1.5
                            ${selectedCategory === category.category ? 'bg-white/20' : 'bg-white'}`}>
                            <Image
                                width={24}
                                height={24}
                                unoptimized
                                src={getCategoryIcon(category.category)}
                                alt={category.category}
                                className={`w-2.5 h-2.5 lg:w-4 lg:h-4 object-contain ${selectedCategory === category.category ? 'brightness-0 invert' : ''}`}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className={`text-xs lg:text-sm font-medium truncate ${selectedCategory === category.category ? 'text-white' : 'text-gray-800'}`}>
                                {category.category}
                            </h3>
                            <p className={`text-[8px] lg:text-[10px] truncate ${selectedCategory === category.category ? 'text-white/80' : 'text-gray-500'}`}>
                                {getCategoryDescription(category.category)} ({category._count.category} tests)
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestCategories;